import { NextFunction, Request, Response } from "express";

import { winstonLogger } from "../startup/logging";
import { GenericAPIResponse } from "../types";

const error = (err: any, req: Request, res: Response, next: NextFunction) => {
  // LOG THE EXCEPTION
  console.log(err);
  winstonLogger().error(err);

  res.status(500).send({
    message: err,
    status: false,
  } as GenericAPIResponse);
};

export default error;
