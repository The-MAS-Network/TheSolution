import { NextFunction, Request, Response } from "express";

import { GenericAPIResponse } from "../types";
import { winstonLogger } from "../startup/logging";

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
