//   const value = new Int64BE(105);
import { Request, Response } from "express";
import Joi, { Schema } from "joi";

import { buildPaginator } from "typeorm-cursor-pagination";
import btcServerBaseAPI from "../api/btcPayServer.api";
import dataSource from "../db/data-source";
import { BtcPayServerPayments } from "../entities/BtcPayServerPayments.entity";
import { Users } from "../entities/Users.entity";
import { LeaderboardTips } from "../entities/ordinal/LeaderboardTips.entity";
import { OrdinalWallets } from "../entities/ordinal/OrdinalWallets.entity";
import { getAuthUser } from "../middlewares/auth";
import { message } from "../middlewares/utility";
import { ValidateCreateInvoiceParams } from "../types";
import {
  CreateOnChainWalletAddressErrorRes,
  CreateOnChainWalletAddressRes,
} from "../types/btcPayServer.types";
import { getMinAndMax, getRandomPercentage } from "../utilities";
import getAppConfig from "../utilities/appConfig";
import { Currencies, LeaderboardDurations } from "../utilities/enums";
import { handleApiErrors } from "../utilities/handleErrors";
import {
  createLightningInvoice,
  getLightningInvoice,
  handleLNURLPayment,
} from "../utilities/lightning/lnd";
import {
  LightningSchema,
  ValidateCreateOnchainAddressReq,
  validateCreateInvoice,
  validateCreateOnchainAddressReq,
  validateGetLeaderboardReq,
} from "../utilities/schemaValidators";
import { formatUserData } from "./user";

export const createInvoice = async (req: Request, res: Response) => {
  // STEP 1: VERIFY IF USER EXISTS

  // VALIDATE REQUEST
  const { error } = validateCreateInvoice(req.body);

  if (error)
    return res.status(400).send(message(false, error.details[0].message));

  const values = req.body as ValidateCreateInvoiceParams;

  // CHECK IF USER EXISTS ALREADY
  const usersRepository = dataSource.getRepository(Users);

  const user = await usersRepository.findOneBy({
    lightningAddress: values.lightningAddress?.trim(),
  });
  if (!user)
    return res
      .status(400)
      .send(
        message(false, "User with the given lightning address does not exist.")
      );

  // STEP 2: CREATE RANDOM NUMBER BETWEEN 1000 to 9999 satoshi AND  GENERATE INVOICE

  const newInvoice = await createLightningInvoice(1000); // CHANGED TO 1000 SATOSHI FIXED
  if (!newInvoice?.description || !newInvoice?.id)
    return res
      .status(400)
      .send(
        message(
          false,
          handleApiErrors(newInvoice, "Sorry Could not create invoice.")
        )
      );

  // STEP 3: SAVE THE NEEDED FIELDS ON THE BACKEND
  const btcPayServerRepository = dataSource.getRepository(BtcPayServerPayments);
  const newbtcPayServerPayment = btcPayServerRepository.create({
    user,
    purpose: values?.purpose,
    currency: Currencies.SATS,
    destination: newInvoice?.request,
    amount: newInvoice?.tokens,
    transactionId: newInvoice?.id,
  });
  const invoice = await btcPayServerRepository.save(newbtcPayServerPayment);

  // STEP 4: SEND TO CLIENT

  return res.status(200).send(
    message(true, "Create invoice success.", {
      destination: invoice?.destination,
    })
  );
};

export const verifyInvoice = async (req: Request, res: Response) => {
  // GET THE INVOICE ID THAT MATCHES THE DESTINATION STRING

  // VALIDATE REQUEST
  const { error } = validateUserLightningDestination(req.body);

  if (error)
    return res.status(400).send(message(false, error.details[0].message));

  const values = req.body as LightningDestination;

  // check destination exists already
  const btcPayServerRepository = dataSource.getRepository(BtcPayServerPayments);

  const btcServerPayment = await btcPayServerRepository.findOne({
    where: { destination: values.destination?.trim() },
    relations: { user: true },
  });
  if (!btcServerPayment)
    return res
      .status(400)
      .send(
        message(false, "Payment with the given destination does not exist.")
      );

  if (btcServerPayment?.user?.lightningAddress !== values?.lightningAddress)
    return res
      .status(400)
      .send(message(false, "Invalid lightning address or destination."));

  if (btcServerPayment?.isVerified) {
    return res
      .status(401)
      .send(
        message(
          false,
          "The transaction with the given Id has already been processed"
        )
      );
  }

  // );
  const singleInvoiceRes = await getLightningInvoice({
    id: btcServerPayment?.transactionId,
  });

  if (!singleInvoiceRes.id)
    return res
      .status(500)
      .send(message(false, `An error occured:`, singleInvoiceRes));

  if (!singleInvoiceRes?.is_confirmed) {
    return res
      .status(400)
      .send(
        message(false, "The payment with the given id is yet to be confirmed")
      );
  }

  // GENERATE RANDOM NUMBER FROM 1 TO 9 TO REPRESENT THE VALUES OF 10% TO 90%

  const totalAmount = Number(btcServerPayment?.amount);

  if (isNaN(totalAmount)) {
    return res
      .status(500)
      .send(
        message(false, `Invalid invoice amount ${btcServerPayment?.amount}`)
      );
  }
  const generatedPercentage = getRandomPercentage();

  // Send firstPayment
  const firstAmount = Math.round(generatedPercentage * totalAmount);

  const secondAmount = totalAmount - firstAmount;

  const firstAmountSentRes = await handleLNURLPayment({
    address: btcServerPayment?.user?.lightningAddress,
    amountInSat: firstAmount,
  });

  if (!firstAmountSentRes.status) {
    return res
      .status(500)
      .send(
        message(
          false,
          `An error occured while trying to make fist payment. Error: ${firstAmountSentRes?.message}`
        )
      );
  }
  // SAVE FIRST PAYMENT ON THE DATABASE

  btcServerPayment.firstPayoutAmount = firstAmount;

  await btcPayServerRepository.save(btcServerPayment);

  const secondAmountSentRes = await handleLNURLPayment({
    address: btcServerPayment?.user?.lightningAddress,
    amountInSat: secondAmount,
  });

  if (!firstAmountSentRes.status) {
    return res
      .status(500)
      .send(
        message(
          false,
          `An error occured while trying to make second payment. Error: ${secondAmountSentRes?.message}`
        )
      );
  }

  // SAVE SECOND PAYMENT ON THE DATABASE

  btcServerPayment.secondPayoutAmount = secondAmount;

  await btcPayServerRepository.save(btcServerPayment);

  return res.send(
    message(true, "Verification success", {
      invoiceId: btcServerPayment.id,
    })
  );
};

export const generateOnChainWalletAddress = async (
  req: Request,
  res: Response
) => {
  // VALIDATE REQUEST
  const decoded = getAuthUser(req, res);

  if (!decoded?.id)
    return res.status(400).send(message(false, "Invalid token."));

  const { error } = validateCreateOnchainAddressReq(req.body);
  if (error) {
    return res.status(400).send(message(false, error.details[0].message));
  }

  const { walletAddress } = req.body as ValidateCreateOnchainAddressReq;

  const userRepository = dataSource.getRepository(Users);
  const user = await userRepository.findOne({
    where: { id: decoded?.id },
    relations: { ordinalWallet: true },
  });

  if (!user)
    return res
      .status(400)
      .send(message(false, "User with the given id address does not exist."));

  if (!user.isVerified) {
    return res.status(403).send(message(false, "User is not verified."));
  }

  if (!!user.ordinalWallet?.onChainWallet) {
    return res
      .status(403)
      .send(message(false, "User already has an assigned onchained wallet."));
  }

  const ordinalWalletsRepository = dataSource.getRepository(OrdinalWallets);

  const userOrdinalWallet = await ordinalWalletsRepository.findOne({
    where: { user: { id: user.id } },
  });

  if (!userOrdinalWallet) {
    const storeId = getAppConfig().btcPayServer_storeId;
    const generateWalletResponse = await btcServerBaseAPI.get<
      CreateOnChainWalletAddressRes,
      CreateOnChainWalletAddressErrorRes
    >(
      `/api/v1/stores/${storeId}/payment-methods/onchain/BTC/wallet/address?forceGenerate=true`
    );

    if (!generateWalletResponse.ok) {
      return res
        .status(503)
        .send(
          message(
            false,
            "An error occured while trying to generate onchain wallet " +
              generateWalletResponse?.data?.message
          )
        );
    }

    const newOrdinalWallet = new OrdinalWallets();
    newOrdinalWallet.address = walletAddress;
    newOrdinalWallet.user = user;
    newOrdinalWallet.onChainWallet =
      generateWalletResponse?.data?.address ?? "";
    await ordinalWalletsRepository.save(newOrdinalWallet);

    const newUser = await userRepository.findOne({
      where: { id: decoded?.id },
      relations: { ordinalWallet: true },
    });
    if (!newUser)
      return res
        .status(400)
        .send(message(false, "User with the given id address does not exist."));

    return res
      .status(201)
      .send(
        message(
          true,
          "Generate onchain wallet address success.",
          formatUserData(newUser)
        )
      );
  } else {
    if (!!userOrdinalWallet.isVerified) {
      return res
        .status(403)
        .send(message(false, "User ordinal wallet is already verified."));
    }

    if (userOrdinalWallet?.address !== walletAddress) {
      userOrdinalWallet.address = walletAddress;
      await ordinalWalletsRepository.save(userOrdinalWallet);
    }

    return res
      .status(200)
      .send(message(true, "Retrieved onchain wallet address success.", user));
  }

  // if (response.ok) {
  //   const onchainPaymentsRepository = dataSource.getRepository(OnchainPayments);

  //   const newOnChainWallet = new OnchainPayments();

  //   newOnChainWallet.storeId = storeId;
  //   newOnChainWallet.user = user;
  //   newOnChainWallet.userSearchAddress = walletAddress;
  //   newOnChainWallet.userOnchainWalletAddress = response?.data?.address ?? "";
  //   newOnChainWallet.userOnchainPaymentLink = response?.data?.paymentLink ?? "";

  //   const details = await onchainPaymentsRepository.save(newOnChainWallet);

  //   const formatedDetails = {
  //     userSearchAddress: details?.userSearchAddress,
  //     userOnchainWalletAddress: details?.userOnchainWalletAddress,
  //     userOnchainPaymentLink: details?.userOnchainPaymentLink,
  //     createdAt: details?.createdAt,
  //   };

  //   return res
  //     .status(200)
  //     .send(
  //       message(true, "Create onchain wallet address success.", formatedDetails)
  //     );
  // } else {
  //   return res
  //     .status(503)
  //     .send(
  //       message(
  //         false,
  //         "An error occured while trying to generate onchain wallet " +
  //           response?.data?.message
  //       )
  //     );
  // }
};

export const getAllTimeLeaderboard = async (req: Request, res: Response) => {
  const size = req.query?.size?.toString();
  const afterCursor = req.query?.cursor?.toString();
  const duration = req.query?.duration?.toString();

  if (!!duration) {
    const { error } = validateGetLeaderboardReq({ duration });
    if (error)
      return res.status(400).send(message(false, error.details[0].message));
  }

  const isWeekly = duration === LeaderboardDurations.WEEKLY;

  const alias = "leaderboardTips";

  let queryBuilder = dataSource
    .getRepository(LeaderboardTips)
    .createQueryBuilder(alias)
    .orderBy(`${alias}.totalTip`, "DESC")
    .leftJoinAndSelect(`${alias}.user`, "user");

  if (isWeekly) {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    queryBuilder = queryBuilder.andWhere(
      `${alias}.updatedAt >= :sevenDaysAgo`,
      { sevenDaysAgo }
    );
  }

  const paginator = buildPaginator({
    entity: LeaderboardTips,
    alias,
    paginationKeys: ["totalTip", "updatedAt", "id"],
    query: {
      limit: getMinAndMax(size ?? ""),
      ...(!!afterCursor ? { afterCursor } : {}),
    },
  });

  const { cursor, data } = await paginator.paginate(queryBuilder);

  const formattedData = data.map(({ totalTip, updatedAt, user }) => {
    return {
      amount: totalTip,
      updatedAt,
      lightningAddress: user?.lightningAddress,
      user: {
        imageURL: user?.imageURL,
      },
    };
  });

  return res.status(200).send(
    message(true, `Tips retrieved successfully.`, formattedData, {
      cursor,
    })
  );
};

interface LightningDestination {
  destination: string;
  lightningAddress: string;
}

export function validateUserLightningDestination(
  destination: LightningDestination
) {
  const patchData: Partial<Record<keyof LightningDestination, Schema>> = {
    destination: Joi.string().min(3).label("Destination").required(),
    lightningAddress: LightningSchema,
  };

  const schema = Joi.object<LightningDestination>(patchData);
  return schema.validate(destination);
}
