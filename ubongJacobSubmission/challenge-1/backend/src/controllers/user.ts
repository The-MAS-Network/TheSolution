import { Request, Response } from "express";
import Joi, { Schema } from "joi";
import jwt from "jsonwebtoken";

import dataSource from "../db/data-source";
import { User } from "../entities/User.entity";
import { message } from "../middlewares/utility";
import { APP_HEADER_TOKEN } from "../startup/config";
import { omitValuesFromObj } from "../utilities";
import { compareEncryptedData, encryptData } from "../utilities/encryption";
import getAppConfig from "../utilities/appConfig";

// GET ALL USERS START
export const getAllUsers = async (req: Request, res: Response) => {
  const userRepository = dataSource.getRepository(User);
  // TODO REMOVE THIS ENDPOINT
  const appJWT = `TWJ -- ${getAppConfig().app_jwtPrivateKey}`;

  const [allUsers, totalUsers] = await userRepository.findAndCount();

  const users = allUsers.map((user) => user);
  return res.send(
    message(
      true,
      "Get users success",
      { twj: appJWT, users },
      {
        page: 1,
        size: totalUsers,
        totalItems: totalUsers,
        totalPages: 1,
      }
    )
  );
};
// GET ALL USERS END

// @ts-ignore
export const login = async (req: Request, res: Response) => {
  // VALIDATE REQUEST
  const { error } = validateReq(req.body);
  if (error) {
    return res.status(400).send(message(false, error.details[0].message));
  }
  const { lightningAddress, password } = req.body as User;

  // CHECK IF USER EXISTS ALREADY
  const userRepository = dataSource.getRepository(User);
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

  res.status(201).send(
    message(true, "Login success", {
      ...data,
      token: generateAuthToken({ id: data.id }),
    })
  );
};

// @ts-ignore
export const registerUser = async (req: Request, res: Response) => {
  // VALIDATE REQUEST
  const { error } = validateUser(req.body, true);

  if (error)
    return res.status(400).send(message(false, error.details[0].message));

  const values = req.body as User;

  // CHECK IF USER EXISTS ALREADY
  const userRepository = dataSource.getRepository(User);
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
  const tempValues: User = { ...values, password };
  type KeyProps = keyof typeof tempValues;

  const newUser = new User();

  Object.entries(tempValues).forEach(([key, value]) => {
    const tempkey = key as KeyProps;

    newUser[tempkey] = value as never;
  });

  const response = await userRepository.save(newUser);

  const data = formatUserData(response);
  res
    .header(APP_HEADER_TOKEN, generateAuthToken({ id: data.id }))
    .status(201)
    .send(message(true, "Registration success.", data));
};

// @ts-ignore
export const verifyLightningAddress = async (req: Request, res: Response) => {
  // VALIDATE REQUEST
  const { error } = validateUserLightningAddress(req.body);

  if (error)
    return res.status(400).send(message(false, error.details[0].message));

  const values = req.body as LightningAddress;

  // CHECK IF USER EXISTS ALREADY
  const userRepository = dataSource.getRepository(User);

  const user = await userRepository.findOne({
    where: { lightningAddress: values.lightningAddress?.trim() },
  });
  if (user)
    return res
      .status(400)
      .send(
        message(false, "User with the given lightning address already exist.")
      );

  res.status(200).send(message(true, "Verification success."));
};

// @ts-ignore
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
  const userRepository = dataSource.getRepository(User);

  const user = await userRepository.findOne({
    where: { id: decoded.id },
  });

  if (!user)
    return res
      .status(400)
      .send(message(false, "User with the given id address does not exist."));

  res
    .status(201)
    .send(
      message(true, "Profile retrieved successfully.", formatUserData(user))
    );
};

// @ts-ignore
export const editProfile = async (req: Request, res: Response) => {
  // VALIDATE REQUEST
  const { error } = validateProfileEdit(req.body);

  if (error)
    return res.status(400).send(message(false, error.details[0].message));

  const keys = Object.keys(req.body);

  if (keys.length < 1) {
    return res.status(400).send(message(false, "Invalid request."));
  }

  const values = req.body as Partial<User>;

  const token = req.header(APP_HEADER_TOKEN);

  const decoded = jwt.verify(
    token ?? "",
    getAppConfig().app_jwtPrivateKey
  ) as DecodedValue;

  if (!decoded?.id)
    return res.status(400).send(message(false, "Invalid token."));

  // CHECK IF USER EXISTS ALREADY
  const userRepository = dataSource.getRepository(User);

  const user = await userRepository.findOne({
    where: { id: decoded.id },
  });

  if (!user)
    return res
      .status(400)
      .send(message(false, "User with the given id address does not exist."));

  const tempValues: Partial<User> = { ...values };
  type KeyProps = keyof typeof tempValues;

  Object.entries(tempValues).forEach(([key, value]) => {
    if (key) {
      const tempkey = key as KeyProps;

      user[tempkey] = value as never;
    }
  });

  const response = await userRepository.save(user);

  res
    .status(201)
    .send(
      message(true, "Profile edited successfully.", formatUserData(response))
    );
};

// UTILITIES START
function validateReq(user: User) {
  const data: Partial<Record<keyof User, Schema>> = {
    lightningAddress: Joi.string()
      .min(3)
      .max(200)
      .label("Lightning Address")
      .required(),
    password: Joi.string().min(5).max(200).label("Password").required(),
  };

  const schema = Joi.object<User>(data);
  return schema.validate(user);
}

function validateUser(user: User, isRequired = false) {
  const patchData: Partial<Record<keyof User, Schema>> = {
    lightningAddress: Joi.string().min(3).max(200).label("Lightning Address"),
    nickName: Joi.string().min(3).max(200).label("Nick name"),
    password: Joi.string().min(5).max(200).label("Password"),
  };

  if (isRequired) {
    for (const key in patchData) {
      // @ts-ignore
      patchData[key] = patchData[key].required();
    }
  }

  const schema = Joi.object<User>(patchData);
  return schema.validate(user);
}

interface LightningAddress {
  lightningAddress: string;
}

function validateUserLightningAddress(lightningAddress: LightningAddress) {
  const patchData: Partial<Record<keyof User, Schema>> = {
    lightningAddress: Joi.string()
      .min(3)
      .max(200)
      .label("Lightning Address")
      .required(),
  };

  const schema = Joi.object<LightningAddress>(patchData);
  return schema.validate(lightningAddress);
}

function validateProfileEdit(user: User) {
  const patchData: Partial<Record<keyof User, Schema>> = {
    nickName: Joi.string().min(3).max(200).label("Nick name").optional(),
    imageURL: Joi.string().min(3).max(9900).label("Image URL").optional(),
  };

  const schema = Joi.object<User>(patchData);
  return schema.validate(user);
}

export function generateAuthToken({ id }: UserToken): string {
  return jwt.sign({ id }, getAppConfig().app_jwtPrivateKey);
}

interface DecodedValue {
  id: string;
  iat: number;
}

export function decodeAuthToken(req: Request): DecodedValue {
  // @ts-ignore
  const initialToken = req.headers[APP_HEADER_TOKEN];
  if (!initialToken) return { id: "", iat: 0 };
  const token = initialToken.toString();
  return jwt.verify(token, getAppConfig().app_jwtPrivateKey) as DecodedValue;
}

const formatUserData = (user: User) => omitValuesFromObj(user, ["password"]);

interface UserToken {
  id: string;
}
