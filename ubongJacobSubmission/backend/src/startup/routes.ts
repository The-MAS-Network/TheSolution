import cors from "cors";
import express, { Express } from "express";
import helmet from "helmet";

import error from "../middlewares/error";
import { logger } from "../middlewares/logger";
import { userRouter } from "../routes/auth";
import { homeRouter } from "../routes/home";
import { paymentRouter } from "../routes/payment";
import { ordinalRouter } from "../routes/ordinals";
import { adminRouter } from "../routes/admin";
import { adminOrdinalCollectionsRouter } from "../routes/admin/ordinalCollections";
import { adminOrdinalsRouter } from "../routes/admin/ordinals";
import { adminPaymentRouter } from "../routes/admin/payments";

export default function (app: Express) {
  // MIDDLEWARES
  app.use(express.json());
  app.use(cors());
  app.use(helmet());
  app.use(logger);

  // CUSTOM MIDDLEWARES
  app.use("/", homeRouter);
  app.use("/api/auth", userRouter);
  app.use("/api/ordinals", ordinalRouter);
  app.use("/api/payment", paymentRouter);

  // ADMIN ROUTES
  app.use("/api/admin", adminRouter);
  app.use("/api/admin/ordinals", adminOrdinalsRouter);
  app.use("/api/admin/ordinal-collections", adminOrdinalCollectionsRouter);
  app.use("/api/admin/payment", adminPaymentRouter);

  // NOTE THIS MIDDLE WARE ERROR MUST BE THE LAST
  app.use(error);
}
