import express, { Express } from "express";
import helmet from "helmet";
import cors from "cors";

import { homeRouter } from "../routes/home";
import { userAuth } from "../routes/auth";
import error from "../middlewares/error";
import { logger } from "../middlewares/logger";

export default function (app: Express) {
  // MIDDLEWARES
  app.use(express.json());
  app.use(cors());
  app.use(helmet());
  app.use(logger);

  // CUSTOM MIDDLEWARES
  app.use("/", homeRouter);
  app.use("/api/auth", userAuth);

  // NOTE THIS MIDDLE WARE ERROR MUST BE THE LAST
  app.use(error);
}
