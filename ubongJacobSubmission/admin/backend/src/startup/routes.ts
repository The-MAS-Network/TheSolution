import cors from "cors";
import express, { Express } from "express";
import helmet from "helmet";

import error from "../middlewares/error";
import { logger } from "../middlewares/logger";
import { userAuth } from "../routes/auth";
import { homeRouter } from "../routes/home";
import { ordinalCollectionsRouter } from "../routes/ordinalCollections";
import { ordinalsRouter } from "../routes/ordinals";

export default function (app: Express) {
  // MIDDLEWARES
  app.use(express.json());
  app.use(cors());
  app.use(helmet());
  app.use(logger);

  // CUSTOM MIDDLEWARES
  app.use("/", homeRouter);
  app.use("/api/auth", userAuth);
  app.use("/api/ordinals", ordinalsRouter);
  app.use("/api/ordinal-collections", ordinalCollectionsRouter);

  // NOTE THIS MIDDLE WARE ERROR MUST BE THE LAST
  app.use(error);
}
