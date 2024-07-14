import { NextFunction, Request, Response } from "express";
import { GenericAPIResponse, MetaData } from "../types";
import sendExternalMessage from "../utilities/sendExternalMessage";

export const asyncMiddleware = (
  handler: (
    req: Request,
    res: Response
  ) => Promise<Response<any, Record<string, any>> | void>
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await handler(req, res);
    } catch (error) {
      sendExternalMessage(`${req?.url} - ${error}`);
      next(error);
    }
  };
};

export const message = (
  status: boolean,
  message: string,
  data?: [] | {},
  metadata?: MetaData
): GenericAPIResponse => ({
  message: formatMessage(message),
  status,
  data,
  metadata,
});

const formatMessage = (message: string) => message.replace(/"/g, "");
