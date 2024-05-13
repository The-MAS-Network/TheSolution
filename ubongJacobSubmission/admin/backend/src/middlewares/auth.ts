import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import { APP_HEADER_TOKEN } from "../startup/config";
import { GenericAPIResponse } from "../types";
import getAppConfig from "../utilities/appConfig";
import { message } from "./utility";

interface DecodedValue {
  email: string;
  iat: number;
}

const userDetailsKey = "appUserDetails";

// @ts-ignore
export function auth(req: Request, res: Response, next: NextFunction) {
  const token = req.header(APP_HEADER_TOKEN);
  if (!token) {
    return res.status(401).send({
      message: "Access denied. No token provided.",
      status: false,
    } as GenericAPIResponse);
  }

  try {
    const decoded = jwt.verify(token, getAppConfig().app_jwtPrivateKey);
    if (typeof decoded === "string" || !decoded?.iat) {
      return res.status(401).send(message(false, "Invalid token."));
    }

    const iatTimestamp = decoded?.iat;
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const durationInSeconds = currentTimestamp - iatTimestamp;
    const durationInHours = Math.floor(durationInSeconds / 3600);

    if (durationInHours > 24) {
      return res.status(401).send(message(false, "Expired auth token."));
    }
    // @ts-ignore
    req[userDetailsKey] = decoded;
    next();
  } catch (error) {
    res.status(401).send(message(false, "Invalid token."));
  }
}

export function getAuthUser(req: Request, res: Response): DecodedValue {
  // @ts-ignore
  const userReq = req[userDetailsKey] as DecodedValue;

  if (!userReq?.email) {
    res.status(500).send(message(false, "System auth not found."));
    return { iat: 0, email: "" };
  } else return userReq;
}

// @ts-ignore
export function secondaryAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.header(APP_HEADER_TOKEN);
  if (!token) {
    return res.status(401).send({
      message: "Access denied. No token provided.",
      status: false,
    } as GenericAPIResponse);
  }

  try {
    const decoded = jwt.verify(
      token,
      getAppConfig().app_secondary_jwtPrivateKey
    );
    if (typeof decoded === "string" || !decoded?.iat) {
      return res.status(401).send(message(false, "Invalid token provided."));
    }

    const iatTimestamp = decoded?.iat;
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const durationInSeconds = currentTimestamp - iatTimestamp;
    const durationInHours = Math.floor(durationInSeconds / 3600);

    if (durationInHours > 24) {
      return res.status(401).send(message(false, "Expired auth token."));
    }
    // @ts-ignore
    req[userDetailsKey] = decoded;
    next();
  } catch (error) {
    res.status(401).send(message(false, "Invalid token."));
  }
}

export function getSecondaryAuthUser(
  req: Request,
  res: Response
): DecodedValue {
  // @ts-ignore
  const userReq = req[userDetailsKey] as DecodedValue;

  if (!userReq?.email) {
    res.status(500).send(message(false, "System auth not found."));
    return { iat: 0, email: "" };
  } else return userReq;
}
