import { Router } from "express";

import { auth } from "../middlewares/auth";
import { asyncMiddleware } from "../middlewares/utility";
import {
  addOrdinalToCollection,
  deleteOrdinal,
  getOrdinalsFromCollectionId,
  getSingleOrdinalOrOrdinalWalletData,
} from "../controllers/ordinals";

const router = Router();

router.post("/", auth, asyncMiddleware(addOrdinalToCollection));
router.get(
  "/:id/data",
  auth,
  asyncMiddleware(getSingleOrdinalOrOrdinalWalletData)
);
router.get("/:id", auth, asyncMiddleware(getOrdinalsFromCollectionId));
router.delete("/:id", auth, asyncMiddleware(deleteOrdinal));
// router.get("/:id", auth, asyncMiddleware(getOrdinalsFromCollectionId));
// router.get("/:id/content", auth, asyncMiddleware(getOrdinalContent));

export { router as ordinalsRouter };
