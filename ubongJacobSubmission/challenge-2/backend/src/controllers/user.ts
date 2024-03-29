import { Request, Response } from "express";
import jwt from "jsonwebtoken";

import dataSource from "../db/data-source";
import { Users } from "../entities/Users.entity";
import { message } from "../middlewares/utility";
import { APP_HEADER_TOKEN } from "../startup/config";
import { omitValuesFromObj } from "../utilities";
import getAppConfig from "../utilities/appConfig";
import { compareEncryptedData, encryptData } from "../utilities/encryption";
import {
  PasswordParam,
  validateChangePassword,
  validateDualAmounts,
  validateLoginReq,
  validateProfileEdit,
  validateUser,
  validateUserLightningAddress,
} from "../utilities/schemaValidators";
import { DualPaymentsParams } from "../types";
import { BtcPayServerPayments } from "../entities/BtcPayServerPayments.entity";
import { getAuthUser } from "../middlewares/auth";

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
  });
  if (!user)
    return res
      .status(400)
      .send(message(false, "Invalid lightning address or password."));

  // VALIDATE PASSWORD
  const validPassword = compareEncryptedData(password, user.password);
  if (!validPassword)
    return res
      .status(400)
      .send(message(false, "Invalid lightning address or password."));

  const data = formatUserData(user);

  return res.status(201).send(
    message(true, "Login success", {
      ...data,
      token: generateAuthToken({ id: data.id }),
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

  // SAVE DATA INTO DATABASE
  const password = encryptData(values.password);
  const tempValues: Users = { ...values, password };
  type KeyProps = keyof typeof tempValues;

  const newUser = new Users();

  Object.entries(tempValues).forEach(([key, value]) => {
    const tempkey = key as KeyProps;

    newUser[tempkey] = value as never;
  });

  const response = await userRepository.save(newUser);

  const data = formatUserData(response);
  return res
    .header(APP_HEADER_TOKEN, generateAuthToken({ id: data.id }))
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

  return res.status(200).send(message(true, "Verification success."));
};

export const getProfile = async (req: Request, res: Response) => {
  // VALIDATE REQUEST
  const token = req.header(APP_HEADER_TOKEN);

  const decoded = jwt.verify(
    token ?? "",
    getAppConfig().app_jwtPrivateKey
  ) as DecodedValue;

  if (!decoded?.id)
    return res.status(400).send(message(false, "Invalid token."));

  // CHECK IF USER EXISTS ALREADY
  const userRepository = dataSource.getRepository(Users);

  const user = await userRepository.findOne({
    where: { id: decoded.id },
  });

  if (!user)
    return res
      .status(400)
      .send(message(false, "User with the given id address does not exist."));

  return res
    .status(201)
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
    where: { id: decoded.id },
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

export const getMaxTrialCount = async (req: Request, res: Response) => {
  const count = getAppConfig().appMaxVerifyDualAmountTrialCount;
  return res.send(message(true, "Get max trial count success.", count));
};

export const verifyDualAmounts = async (req: Request, res: Response) => {
  // VALIDATE REQUEST
  const { error } = validateDualAmounts(req.body);

  if (error)
    return res.status(400).send(message(false, error.details[0].message));

  const { id, lightningAddress, firstAmount, secondAmount } =
    req.body as DualPaymentsParams;

  const btcPayServerRepository = dataSource.getRepository(BtcPayServerPayments);

  const btcServerPayment = await btcPayServerRepository.findOne({
    where: { id },
  });

  if (!btcServerPayment) {
    return res
      .status(400)
      .send(message(false, "Invalid Id or lightning address."));
  }

  if (btcServerPayment?.lightningAddress !== lightningAddress) {
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
    return res.status(201).send(
      message(true, "Verification success.", {
        token: generateAuthToken({ id }),
      })
    );
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
    where: { lightningAddress: btcServerPayment?.lightningAddress },
  });

  if (!user)
    return res
      .status(400)
      .send(
        message(false, "User with the given transaction id does not exist.")
      );

  const password = encryptData(values.password);

  const tempValues: Partial<Users> = { password };
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

// UTILITIES START

export interface LightningAddress {
  lightningAddress: string;
}

export function generateAuthToken({ id }: UserToken): string {
  return jwt.sign({ id }, getAppConfig().app_jwtPrivateKey);
}

interface DecodedValue {
  id: string;
  iat: number;
}

const formatUserData = (user: Users) => omitValuesFromObj(user, ["password"]);

interface UserToken {
  id: string;
}
