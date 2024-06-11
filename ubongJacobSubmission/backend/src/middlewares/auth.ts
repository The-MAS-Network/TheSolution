import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import { APP_HEADER_TOKEN } from "../startup/config";
import { GenericAPIResponse } from "../types";
import getAppConfig from "../utilities/appConfig";
import { rateLimitByKey } from "../utilities/rateLimiter";
import { message } from "./utility";

const userDetailsKey = "appUserDetailsKey";

type UserType = "USER" | "ADMIN" | "UNKNOWN" | "SECONDARY";

interface AuthToken {
  id: string;
  type?: UserType;
}

interface DecodedValue extends AuthToken {
  iat: number;
}

// @ts-ignore
const verifyAndLimitUserReq = (
  req: Request,
  res: Response,
  userType: UserType
) => {
  const user = getAuthUser(req, res);
  if (user?.type !== userType) {
    return res.status(401).send(message(false, "Unauthorized."));
  }

  const rateLimitError = rateLimitByKey(user?.id);

  if (!!rateLimitError) {
    return res.status(400).send(message(false, rateLimitError));
  }
};

const verifyToken = (
  req: Request,
  res: Response,
  privateKey: string,
  duration = 24
) => {
  const token = req.header(APP_HEADER_TOKEN);
  if (!token) {
    return res.status(401).send({
      message: "Access denied. No token provided.",
      status: false,
    } as GenericAPIResponse);
  }

  const decoded = jwt.verify(token, privateKey);

  if (typeof decoded === "string" || !decoded?.iat) {
    return res.status(401).send(message(false, "Invalid token."));
  }

  const iatTimestamp = decoded?.iat;
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const durationInSeconds = currentTimestamp - iatTimestamp;
  const durationInHours = Math.floor(durationInSeconds / 3600);

  if (durationInHours > duration) {
    return res.status(401).send(message(false, "Expired auth token."));
  }

  req.headers[userDetailsKey] = JSON.stringify(decoded);

  // // @ts-ignore
  // req.headers[userDetailsKey] = decoded;
  return;
};

export function auth(req: Request, res: Response, next: NextFunction) {
  try {
    verifyToken(req, res, getAppConfig().app_jwtPrivateKey);

    verifyAndLimitUserReq(req, res, "USER");
    next();
  } catch (error) {
    res.status(401).send(message(false, "Invalid token."));
  }
}

export function adminAuth(req: Request, res: Response, next: NextFunction) {
  try {
    verifyToken(req, res, getAppConfig().app_adminJwtPrivateKey);

    verifyAndLimitUserReq(req, res, "ADMIN");

    next();
  } catch (error) {
    res.status(401).send(message(false, "Invalid token"));
  }
}

export function secondaryAuth(req: Request, res: Response, next: NextFunction) {
  try {
    verifyToken(req, res, getAppConfig().app_secondary_jwtPrivateKey, 0.167);

    verifyAndLimitUserReq(req, res, "SECONDARY");

    next();
  } catch (error) {
    res.status(401).send(message(false, "Invalid token."));
  }
  return;
}

export function getAuthUser(
  req: Request,
  res: Response
): DecodedValue | undefined {
  const userDetails = req?.headers?.[userDetailsKey] ?? "";

  const userReq = JSON.parse(userDetails?.toString()) as DecodedValue;

  if (!userReq?.id) {
    res.status(500).send(message(false, "System auth not found."));
    return;
  } else return userReq;
}

export function generateUserAuthToken(props: AuthToken): string {
  const { id, type = "USER" } = props;
  return jwt.sign({ id, type }, getAppConfig().app_jwtPrivateKey);
}

export function generateAdminAuthToken(props: AuthToken): string {
  const { id, type = "ADMIN" } = props;
  return jwt.sign({ id, type }, getAppConfig().app_adminJwtPrivateKey);
}

export function generateSecondaryAuthToken(props: AuthToken): string {
  const { id, type = "SECONDARY" } = props;
  return jwt.sign({ id, type }, getAppConfig().app_secondary_jwtPrivateKey);
}
