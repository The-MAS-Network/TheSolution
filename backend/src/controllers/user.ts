import bcrypt from "bcrypt";
import { Request, Response } from "express";

import { sendSats } from "../api/btcPayServer.api";
import { hiroSoBaseApi } from "../api/external.api";
import dataSource from "../db/data-source";
import {
  BtcPayServerPayments,
  CreateInvoicePurpose,
} from "../entities/BtcPayServerPayments.entity";
import { Users } from "../entities/Users.entity";
import { OrdinalWallets } from "../entities/ordinal/OrdinalWallets.entity";
import { confirmWalletsPayment } from "./helpers/ordinals";
import { generateUserAuthToken, getAuthUser } from "../middlewares/auth";
import { message } from "../middlewares/utility";
import { APP_HEADER_TOKEN } from "../startup/config";
import { DualPaymentsParams } from "../types";
import {
  GetOrdinalError,
  GetOrdinalsFromWalletAddress,
} from "../types/ordinals.types";
import { omitValuesFromObj } from "../utilities";
import getAppConfig from "../utilities/appConfig";
import { calculateTimeDifference } from "../utilities/dateTimeHelpers";
import {
  PasswordParam,
  validateChangePassword,
  validateDeleteAccount,
  validateDualAmounts,
  validateLoginReq,
  validateProfileEdit,
  validateUser,
  validateUserLightningAddress,
} from "../utilities/schemaValidators";

export const login = async (req: Request, res: Response) => {
  // VALIDATE REQUEST
  const { error } = validateLoginReq(req.body);
  if (error) {
    return res.status(400).send(message(false, error.details[0].message));
  }
  const { lightningAddress, password } = req.body as Users;

  // CHECK IF USER EXISTS ALREADY
  const userRepository = dataSource.getRepository(Users);
  const user = await userRepository.findOne({
    where: { lightningAddress: lightningAddress?.trim() },
    relations: { ordinalWallet: true },
  });
  if (!user)
    return res
      .status(400)
      .send(message(false, "Invalid lightning address or password."));

  // VALIDATE PASSWORD
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword)
    return res
      .status(400)
      .send(message(false, "Invalid lightning address or password."));

  if (
    !user.isVerified &&
    calculateTimeDifference(user?.createdAt).newHours >= 24
  ) {
    await userRepository.remove(user);

    return res
      .status(401)
      .send(
        message(
          false,
          "Looks like there might have been a verification issue with this account. To keep things secure, accounts need to be verified within 24 hours. No worries though, just try creating a new account and we'll get you set up in no time!"
        )
      );
  }

  const data = formatUserData(user);

  return res.status(201).send(
    message(true, "Login success", {
      ...data,
      token: generateUserAuthToken({ id: data.id }),
    })
  );
};

export const registerUser = async (req: Request, res: Response) => {
  // VALIDATE REQUEST
  const { error } = validateUser(req.body, true);

  if (error)
    return res.status(400).send(message(false, error.details[0].message));

  const values = req.body as Users;

  // CHECK IF USER EXISTS ALREADY
  const userRepository = dataSource.getRepository(Users);
  const user = await userRepository.findOne({
    where: { lightningAddress: values.lightningAddress?.trim() },
  });
  if (user)
    return res
      .status(400)
      .send(
        message(false, "User with the given lightning address already exist.")
      );

  const isOnline = await checkIfLightningAddressIsOnline(
    values.lightningAddress?.trim()
  );

  if (!isOnline) {
    return res
      .status(503)
      .send(message(false, "Error fetching lightning address data."));
  }

  // SAVE DATA INTO DATABASE
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(values.password, salt);
  const tempValues: Users = { ...values, password: hashedPassword };
  type KeyProps = keyof typeof tempValues;

  const newUser = new Users();

  Object.entries(tempValues).forEach(([key, value]) => {
    const tempkey = key as KeyProps;

    newUser[tempkey] = value as never;
  });

  const response = await userRepository.save(newUser);

  const data = formatUserData(response);
  return res
    .header(APP_HEADER_TOKEN, generateUserAuthToken({ id: data.id }))
    .status(201)
    .send(message(true, "Registration success.", data));
};

export const verifyLightningAddress = async (req: Request, res: Response) => {
  // VALIDATE REQUEST
  const { error } = validateUserLightningAddress(req.body);

  if (error)
    return res.status(400).send(message(false, error.details[0].message));

  const values = req.body as LightningAddress;

  // CHECK IF USER EXISTS ALREADY
  const userRepository = dataSource.getRepository(Users);

  const user = await userRepository.findOne({
    where: { lightningAddress: values.lightningAddress?.trim() },
  });
  if (user)
    return res
      .status(400)
      .send(
        message(false, "User with the given lightning address already exist.")
      );

  const isOnline = await checkIfLightningAddressIsOnline(
    values.lightningAddress?.trim()
  );

  if (!isOnline) {
    return res
      .status(503)
      .send(message(false, "Error fetching lightning address data."));
  }

  return res.status(200).send(message(true, "Verification success."));
};

export const getProfile = async (req: Request, res: Response) => {
  // VALIDATE REQUEST

  const decoded = getAuthUser(req, res);

  if (!decoded?.id)
    return res.status(400).send(message(false, "Invalid token."));

  // CHECK IF USER EXISTS ALREADY
  const userRepository = dataSource.getRepository(Users);

  const user = await userRepository.findOne({
    where: { id: decoded?.id },
    relations: { ordinalWallet: true },
  });

  if (!user)
    return res
      .status(400)
      .send(message(false, "User with the given id address does not exist."));

  return res
    .status(200)
    .send(
      message(true, "Profile retrieved successfully.", formatUserData(user))
    );
};

export const editProfile = async (req: Request, res: Response) => {
  // VALIDATE REQUEST
  const { error } = validateProfileEdit(req.body);

  if (error)
    return res.status(400).send(message(false, error.details[0].message));

  const keys = Object.keys(req.body);

  if (keys.length < 1) {
    return res.status(400).send(message(false, "Invalid request."));
  }

  const values = req.body as Partial<Users>;

  const decoded = getAuthUser(req, res);

  // CHECK IF USER EXISTS ALREADY
  const userRepository = dataSource.getRepository(Users);

  const user = await userRepository.findOne({
    where: { id: decoded?.id },
  });

  if (!user)
    return res
      .status(400)
      .send(message(false, "User with the given id address does not exist."));

  const tempValues: Partial<Users> = { ...values };
  type KeyProps = keyof typeof tempValues;

  Object.entries(tempValues).forEach(([key, value]) => {
    if (key) {
      const tempkey = key as KeyProps;

      user[tempkey] = value as never;
    }
  });

  const response = await userRepository.save(user);

  return res.send(
    message(true, "Profile edited successfully.", formatUserData(response))
  );
};

export const deleteAccount = async (req: Request, res: Response) => {
  // VALIDATE REQUEST
  const { error } = validateDeleteAccount(req.body);

  if (error)
    return res.status(400).send(message(false, error.details[0].message));

  const values = req.body as Partial<Users>;

  const decoded = getAuthUser(req, res);

  // CHECK IF USER EXISTS ALREADY
  const userRepository = dataSource.getRepository(Users);

  const user = await userRepository.findOne({
    where: { id: decoded?.id },
  });

  if (!user)
    return res
      .status(400)
      .send(message(false, "User with the given id does not exist."));

  const validPassword = await bcrypt.compare(
    values?.password ?? "",
    user.password
  );
  if (!validPassword)
    return res.status(400).send(message(false, "Invalid password."));

  await userRepository.remove(user);

  return res.send(message(true, "Account deleted successfully."));
};

export const getMaxTrialCount = async (req: Request, res: Response) => {
  const count = getAppConfig().appMaxVerifyDualAmountTrialCount;
  return res.send(message(true, "Get max trial count success.", count));
};

export const verifyDualAmounts = async (req: Request, res: Response) => {
  // VALIDATE REQUEST
  const { error } = validateDualAmounts(req.body);

  if (error)
    return res.status(400).send(message(false, error.details[0].message));

  const { id, lightningAddress, firstAmount, secondAmount, purpose } =
    req.body as DualPaymentsParams;

  const reqPurpose = purpose as CreateInvoicePurpose;

  const btcPayServerRepository = dataSource.getRepository(BtcPayServerPayments);

  const btcServerPayment = await btcPayServerRepository.findOne({
    where: { id },
    relations: { user: true },
  });

  if (!btcServerPayment) {
    return res
      .status(400)
      .send(message(false, "Invalid Id or lightning address."));
  }

  if (btcServerPayment?.user?.lightningAddress !== lightningAddress) {
    return res
      .status(400)
      .send(message(false, "Invalid Id or lightning address."));
  }

  if (btcServerPayment.isVerified) {
    return res
      .status(401)
      .send(message(false, "This transaction has already been processed."));
  }

  if (
    btcServerPayment.trialCount >
    getAppConfig().appMaxVerifyDualAmountTrialCount
  ) {
    return res
      .status(401)
      .send(message(false, "Maximum trial exceeded for this transaction."));
  }

  if (!btcServerPayment?.firstPayoutAmount) {
    return res
      .status(400)
      .send(
        message(
          false,
          `First payout amount for the given id has not yet been sent.`
        )
      );
  }
  if (!btcServerPayment?.secondPayoutAmount) {
    return res
      .status(400)
      .send(
        message(
          false,
          `Second payout amount for the given id has not yet been sent.`
        )
      );
  }

  const firstPay = btcServerPayment?.firstPayoutAmount;
  const secondPay = btcServerPayment?.secondPayoutAmount;

  if (
    (firstPay == firstAmount && secondPay == secondAmount) ||
    (firstPay == secondAmount && secondPay == firstAmount)
  ) {
    if (reqPurpose === "forgot_password") {
      return res.status(201).send(
        message(true, "Verification success.", {
          token: generateUserAuthToken({ id }),
        })
      );
    } else {
      const userRepository = dataSource.getRepository(Users);

      const user = await userRepository.findOne({
        where: { lightningAddress },
      });

      if (!user) {
        return res
          .status(400)
          .send(
            message(
              false,
              "User with the given lightning address does not exist."
            )
          );
      }

      user.isVerified = true;

      const response = await userRepository.save(user);

      return res
        .status(200)
        .send(
          message(true, "User verified successfully.", formatUserData(response))
        );
    }
  } else {
    btcServerPayment.trialCount += 1;

    const trialCountRes = await btcPayServerRepository.save(btcServerPayment);
    if (firstPay !== firstAmount) {
      return res.status(400).send(
        message(
          false,
          `The given first payout amount of ${firstAmount} is incorrect.`,
          {
            trialCount: trialCountRes?.trialCount,
          }
        )
      );
    }

    if (btcServerPayment?.secondPayoutAmount !== secondAmount) {
      return res.status(400).send(
        message(
          false,
          `The given second payout amount of ${secondAmount} is incorrect.`,
          {
            trialCount: trialCountRes?.trialCount,
          }
        )
      );
    }

    return res.status(400).send(
      message(
        false,
        `The given payout amounts of ${firstAmount} and ${secondAmount} is incorrect.`,
        {
          trialCount: trialCountRes?.trialCount,
        }
      )
    );
  }
};

export const changePassword = async (req: Request, res: Response) => {
  // VALIDATE REQUEST
  const { error } = validateChangePassword(req.body);

  if (error)
    return res.status(400).send(message(false, error.details[0].message));

  const values = req.body as PasswordParam;
  const decoded = getAuthUser(req, res);

  const btcPayServerRepository = dataSource.getRepository(BtcPayServerPayments);
  const btcServerPayment = await btcPayServerRepository.findOne({
    where: { id: decoded?.id },
    relations: { user: true },
  });
  if (!btcServerPayment) {
    return res.status(400).send(message(false, "Invalid transaction Id given"));
  }

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

  // CHECK IF USER EXISTS ALREADY
  const userRepository = dataSource.getRepository(Users);
  const user = await userRepository.findOne({
    where: { lightningAddress: btcServerPayment?.user?.lightningAddress },
  });

  if (!user)
    return res
      .status(400)
      .send(
        message(false, "User with the given transaction id does not exist.")
      );

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(values.password, salt);

  const tempValues: Partial<Users> = { password: hashedPassword };
  type KeyProps = keyof typeof tempValues;

  Object.entries(tempValues).forEach(([key, value]) => {
    if (key) {
      const tempkey = key as KeyProps;

      user[tempkey] = value as never;
    }
  });

  const response = await userRepository.save(user);

  const editedInvoice: Partial<BtcPayServerPayments> = {
    isVerified: true,
  };

  Object.entries(editedInvoice).forEach(([key, value]) => {
    if (key) {
      const invoiceKey = key as keyof typeof btcServerPayment;
      btcServerPayment[invoiceKey] = value as never;
    }
  });

  await btcPayServerRepository.save(btcServerPayment);

  return res.send(
    message(true, "Password changed successfully.", formatUserData(response))
  );
};

export const getUserOrdinals = async (req: Request, res: Response) => {
  // VALIDATE REQUEST

  const decoded = getAuthUser(req, res);

  if (!decoded?.id)
    return res.status(400).send(message(false, "Invalid token."));

  // CHECK IF USER EXISTS ALREADY
  const userRepository = dataSource.getRepository(Users);

  const user = await userRepository.findOne({
    where: { id: decoded?.id },
    relations: { ordinalWallet: true },
  });

  if (!user)
    return res
      .status(400)
      .send(message(false, "User with the given id address does not exist."));

  if (!user?.ordinalWallet?.address)
    return res
      .status(400)
      .send(
        message(
          false,
          "User with the given id address does not have a verified ordinal wallet."
        )
      );

  const response = await hiroSoBaseApi.get<
    GetOrdinalsFromWalletAddress,
    GetOrdinalError
  >(`/inscriptions?address=${user?.ordinalWallet?.address}`);

  if (response.ok) {
    return res
      .status(200)
      .send(
        message(true, "Wallet ordinals retrieved successfully.", response?.data)
      );
  } else {
    return res
      .status(503)
      .send(
        message(
          false,
          response?.data?.error ??
            "An error occured when getting ordinals with the given id."
        )
      );
  }
};

export const disconnectOrdinalWallet = async (req: Request, res: Response) => {
  const decoded = getAuthUser(req, res);

  if (!decoded?.id)
    return res.status(400).send(message(false, "Invalid token."));

  // CHECK IF USER EXISTS ALREADY
  const ordinalWalletsRepository = dataSource.getRepository(OrdinalWallets);

  const ordinalWallet = await ordinalWalletsRepository.findOneBy({
    user: { id: decoded?.id },
  });

  if (!ordinalWallet)
    return res
      .status(400)
      .send(
        message(false, "Ordinal wallet with the given user id  does not exist.")
      );

  await ordinalWalletsRepository.remove(ordinalWallet);

  return res.send(message(true, "Ordinal wallet disconnected successfully."));
};

export const verifyOrdinalTransaction = async (req: Request, res: Response) => {
  const decoded = getAuthUser(req, res);

  // CHECK IF USER EXISTS ALREADY
  const ordinalWalletsRepository = dataSource.getRepository(OrdinalWallets);

  const ordinalWallet = await ordinalWalletsRepository.findOne({
    where: { user: { id: decoded?.id } },
    relations: { user: true },
  });

  if (!ordinalWallet)
    return res
      .status(400)
      .send(
        message(false, "Ordinal wallet with the given user id  does not exist.")
      );
  const formattedOrdinalWallet = {
    ...ordinalWallet,
    user: formatUserData(ordinalWallet?.user),
  };
  if (!!ordinalWallet?.isVerified)
    return res
      .status(403)
      .send(
        message(
          false,
          "User ordinal wallet is already verified.",
          formattedOrdinalWallet
        )
      );

  const resDetails = await confirmWalletsPayment(
    ordinalWallet,
    ordinalWalletsRepository
  );

  if (resDetails.status === false) {
    return res
      .status(500)
      .send(message(false, resDetails.message, formattedOrdinalWallet));
  }

  // CHECK IF USER EXISTS ALREADY
  const userRepository = dataSource.getRepository(Users);

  const user = await userRepository.findOne({
    where: { id: decoded?.id },
    relations: { ordinalWallet: true },
  });

  if (!user)
    return res
      .status(400)
      .send(message(false, "User with the given id address does not exist."));

  return res
    .status(200)
    .send(
      message(true, "Profile retrieved successfully.", formatUserData(user))
    );
};

export async function checkIfLightningAddressIsOnline(address: string) {
  const storeId = getAppConfig().btcPayServer_storeId;
  const response = await sendSats({ address, amount: 0.000000001, storeId });

  if (response.ok) {
    return true;
  } else if (
    response?.status === 422 ||
    response?.data?.[0]?.message ===
      "The LNURL / Lightning Address provided was not online."
  ) {
    return false;
  } else return true;
}

// UTILITIES START

export interface LightningAddress {
  lightningAddress: string;
}

export const formatUserData = (user: Users) =>
  omitValuesFromObj(user, ["password"]);
