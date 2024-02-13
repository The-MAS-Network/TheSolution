import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import { APP_HEADER_TOKEN } from "../startup/config";
import { GenericAPIResponse } from "../types";
import getAppConfig from "../utilities/appConfig";
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
    //   @ts-ignore
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).send({
      message: "Invalid token.",
      status: false,
    } as GenericAPIResponse);
  }
}
