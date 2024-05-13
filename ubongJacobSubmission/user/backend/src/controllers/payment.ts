//   const value = new Int64BE(105);
import { Request, Response } from "express";
import Joi, { Schema } from "joi";

import btcServerBaseAPI from "../api/btcPayServer.api";
import dataSource from "../db/data-source";
import { BtcPayServerPayments } from "../entities/BtcPayServerPayments.entity";
import { Users } from "../entities/Users.entity";
import { getAuthUser } from "../middlewares/auth";
import { message } from "../middlewares/utility";
import { ValidateCreateInvoiceParams } from "../types";
import {
  CreateNewInvoiceRes,
  CreateOnChainWalletAddressErrorRes,
  CreateOnChainWalletAddressRes,
  CreatePayoutRes,
  GetPaymentMethodDetailsRes,
} from "../types/btcPayServer.types";
import { convertValueToSats, getRandomPercentage } from "../utilities";
import getAppConfig from "../utilities/appConfig";
import { handleApiErrors } from "../utilities/handleErrors";
import {
  LightningSchema,
  ValidateCreateOnchainAddressReq,
  validateCreateInvoice,
  validateCreateOnchainAddressReq,
} from "../utilities/schemaValidators";
import { OrdinalWallets } from "../entities/OrdinalWallets.entity";
import { formatUserData } from "./user";

// @ts-ignore
export const createInvoice = async (req: Request, res: Response) => {
  // STEP 1: VERIFY IF USER EXISTS

  // VALIDATE REQUEST
  const { error } = validateCreateInvoice(req.body);

  if (error)
    return res.status(400).send(message(false, error.details[0].message));

  const values = req.body as ValidateCreateInvoiceParams;

  // CHECK IF USER EXISTS ALREADY
  const usersRepository = dataSource.getRepository(Users);

  const user = await usersRepository.findOne({
    where: { lightningAddress: values.lightningAddress?.trim() },
  });
  if (!user)
    return res
      .status(400)
      .send(
        message(false, "User with the given lightning address does not exist.")
      );

  // STEP 2: CREATE RANDOM NUMBER BETWEEN 1000 to 9999 satoshi AND  GENERATE PAYMENT LINK
  const amount = 1000; // CHANGED TO 1000 SATOSHI FIXED

  const STORE_ID = getAppConfig().btcPayServer_storeId;

  const createNewInvoiceRes = await btcServerBaseAPI.post<CreateNewInvoiceRes>(
    `/api/v1/stores/${STORE_ID}/invoices`,
    {
      amount,
      expiry: 86400, // TIME IN SECONDS EQUIVALENT TO 24 HOURS
      checkout: {
        paymentMethods: ["BTC-LightningNetwork"],
      },
    }
  );

  if (!createNewInvoiceRes?.ok || !createNewInvoiceRes?.data)
    return res
      .status(400)
      .send(
        message(
          false,
          handleApiErrors(
            createNewInvoiceRes,
            "Sorry Could not create invoice."
          )
        )
      );

  // STEP 3: SAVE THE NEEDED FIELDS ON THE BACKEND

  const initialValues: Partial<BtcPayServerPayments> = {
    amount: createNewInvoiceRes?.data?.amount,
    checkoutLink: createNewInvoiceRes?.data?.checkoutLink,
    currency: createNewInvoiceRes?.data?.currency,
    lightningAddress: user?.lightningAddress,
    storeId: createNewInvoiceRes?.data?.storeId,
    storeTransactionId: createNewInvoiceRes?.data?.id,
    purpose: values?.purpose,
  };

  const btcPayServerRepository = dataSource.getRepository(BtcPayServerPayments);

  const newbtcPayServerPayment = new BtcPayServerPayments();

  type KeyProps = keyof typeof newbtcPayServerPayment;

  Object.entries(initialValues).forEach(([key, value]) => {
    const tempkey = key as KeyProps;

    newbtcPayServerPayment[tempkey] = value as never;
  });

  newbtcPayServerPayment.user = user;

  const firstStepSaveResponse = await btcPayServerRepository.save(
    newbtcPayServerPayment
  );
  const INVOICE_ID = firstStepSaveResponse.storeTransactionId;
  // STEP 4: GET BTC-LightningNetwork ADDRESS

  const getLightningAddressRes =
    await btcServerBaseAPI.get<GetPaymentMethodDetailsRes>(
      `/api/v1/stores/${STORE_ID}/invoices/${INVOICE_ID}/payment-methods`
    );

  if (!getLightningAddressRes?.ok || !getLightningAddressRes?.data)
    return res
      .status(400)
      .send(
        message(
          false,
          handleApiErrors(
            getLightningAddressRes,
            "Sorry Could not get supported payment methods."
          )
        )
      );

  const btcServerPayment = await btcPayServerRepository.findOne({
    where: { id: firstStepSaveResponse.id },
  });

  if (!btcServerPayment)
    return res
      .status(400)
      .send(
        message(false, "Payment with the given internal id does not exist.")
      );

  const editedInvoice: Partial<BtcPayServerPayments> = {
    destination: getLightningAddressRes?.data?.[0]?.destination,
    paymentHash: getLightningAddressRes?.data?.[0]?.additionalData?.paymentHash,
  };

  Object.entries(editedInvoice).forEach(([key, value]) => {
    if (key) {
      const tempkey = key as KeyProps;
      btcServerPayment[tempkey] = value as never;
    }
  });

  const secondStepSaveResponse = await btcPayServerRepository.save(
    btcServerPayment
  );

  // STEP 5: SEND TO CLIENT

  res.status(200).send(
    message(true, "Create invoice success.", {
      destination: secondStepSaveResponse?.destination,
    })
  );

  // const response = await btcServerBaseAPI.get(
  //   `/api/v1/stores/${
  //     getAppConfig().btcPayServer_storeId
  //   }/invoices/VZV9FWwjjxJ6LM6ytqNPJh`
  // );

  // res.send(response?.data);
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
  });
  if (!btcServerPayment)
    return res
      .status(400)
      .send(
        message(false, "Payment with the given destination does not exist.")
      );

  if (btcServerPayment?.lightningAddress !== values?.lightningAddress)
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

  const STORE_ID = getAppConfig().btcPayServer_storeId;

  // const response = await btcServerBaseAPI.get(
  //   `/api/v1/stores/${STORE_ID}/lightning/btc/invoices/${btcServerPayment?.storeTransactionId}`
  // );
  const singleInvoiceRes = await btcServerBaseAPI.get<CreateNewInvoiceRes>(
    `/api/v1/stores/${STORE_ID}/invoices/${btcServerPayment?.storeTransactionId}`
  );

  if (!singleInvoiceRes.ok)
    return res
      .status(500)
      .send(message(false, `An error occured:`, singleInvoiceRes?.data));

  if (singleInvoiceRes?.data?.status !== "Settled") {
    return res
      .status(400)
      .send(
        message(
          false,
          `Payment is not yet prcoessed. The current status of this transaction is ${singleInvoiceRes?.data?.status}`
        )
      );
  }

  // GENERATE RANDOM NUMBER FROM 1 TO 9 TO REPRESENT THE VALUES OF 10% TO 90%

  const totalAmount = Number(singleInvoiceRes?.data?.amount);

  if (isNaN(totalAmount)) {
    return res
      .status(500)
      .send(
        message(
          false,
          `Invalid invoice amount ${singleInvoiceRes?.data?.amount}`
        )
      );
  }
  const generatedPercentage = getRandomPercentage();

  // Send firstPayment
  const firstAmount = Math.round(generatedPercentage * totalAmount);

  const secondAmount = totalAmount - firstAmount;

  const firstAmountSentRes = await btcServerBaseAPI.post<CreatePayoutRes>(
    `/api/v1/stores/${STORE_ID}/payouts`,
    {
      destination: btcServerPayment?.lightningAddress,
      amount: convertValueToSats(firstAmount),
      paymentMethod: "BTC-LightningLike",
      approved: true,
    }
  );

  if (!firstAmountSentRes.ok) {
    return res
      .status(500)
      .send(
        message(
          false,
          `An error occured while trying to make fist payment. Error: ${handleApiErrors(
            firstAmountSentRes
          )}`
        )
      );
  }
  // SAVE FIRST PAYMENT ON THE DATABASE

  btcServerPayment.firstPayoutAmount = firstAmount;

  await btcPayServerRepository.save(btcServerPayment);

  const secondAmountSentRes = await btcServerBaseAPI.post<CreatePayoutRes>(
    `/api/v1/stores/${STORE_ID}/payouts`,
    {
      destination: btcServerPayment?.lightningAddress,
      amount: convertValueToSats(secondAmount),
      paymentMethod: "BTC-LightningLike",
      approved: true,
    }
  );

  if (!secondAmountSentRes.ok) {
    return res
      .status(500)
      .send(
        message(
          false,
          `An error occured while trying to make second payment. Error: ${handleApiErrors(
            firstAmountSentRes
          )}`
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
    where: { id: decoded.id },
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
      "/api/v1/stores/" +
        storeId +
        "/payment-methods/onchain/BTC/wallet/address?forceGenerate=true"
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
      where: { id: decoded.id },
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

// export const getInvoice = async (req: Request, res: Response) => {
//   //   const value = new Int64BE(105);
//   //   const amount = 10432;

//   //   const permission = "btcpay.store.canmodifystoresettings";
//   //   const apikey = {
//   //     label: "LABELNAME",
//   //     permissions: [permission],
//   //   };

//   //   const response = await btcServerBaseAPI.post(`/api/v1/api-keys`, {
//   //     apikey,
//   //   });

//   const storeID = "3iji4NKqGKSSxQ1YkmrAaSQhfRAjfzST9DqgWbbfSgb2";
//   const response = await btcServerBaseAPI.get(
//     `/api/v1/stores/${storeID}/lightning/btc/invoices/c049d29d2d4e96b68b93bfab696aee6a72d7dc3731687ee507d629323e898552`
//   );

//   res.send(response?.data);
// };
// export const sendPayments = async (req: Request, res: Response) => {
//   //   const value = new Int64BE(105);
//   //   const amount = 10432;

//   //   const permission = "btcpay.store.canmodifystoresettings";
//   //   const apikey = {
//   //     label: "LABELNAME",
//   //     permissions: [permission],
//   //   };

//   //   const response = await btcServerBaseAPI.post(`/api/v1/api-keys`, {
//   //     apikey,
//   //   });

//   const storeID = "8S9deS2eK4GhfhEf2HvwrZPyGdZ81tmDkCUaN4LD7F6C";
//   const response = await btcServerBaseAPI.post(
//     `/api/v1/stores/${storeID}/payouts`,
//     {
//       destination: "ubongjacob@bitnob.io",
//       amount: "0.0000123",
//       paymentMethod: "BTC-LightningLike",
//     }
//   );

//   res.send(response?.data);
// };

interface LightningDestination {
  destination: string;
  lightningAddress: string;
}

export function validateUserLightningDestination(
  destination: LightningDestination
) {
  const patchData: Partial<Record<keyof BtcPayServerPayments, Schema>> = {
    destination: Joi.string().min(3).label("Destination").required(),
    lightningAddress: LightningSchema,
  };

  const schema = Joi.object<LightningDestination>(patchData);
  return schema.validate(destination);
}
