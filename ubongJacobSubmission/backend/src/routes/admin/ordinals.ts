import { Router } from "express";

import {
  addOrdinalToCollection,
  deleteOrdinal,
  getOrdinalsFromCollectionId,
  getSingleOrdinalOrOrdinalWalletData,
} from "../../controllers/ordinals";
import { adminAuth } from "../../middlewares/auth";
import { asyncMiddleware } from "../../middlewares/utility";

const router = Router();

router.post("/", adminAuth, asyncMiddleware(addOrdinalToCollection));
router.get(
  "/:id/data",
  adminAuth,
  asyncMiddleware(getSingleOrdinalOrOrdinalWalletData)
);
router.get("/:id", adminAuth, asyncMiddleware(getOrdinalsFromCollectionId));
router.post("/delete", adminAuth, asyncMiddleware(deleteOrdinal));
// router.get("/:id", auth, asyncMiddleware(getOrdinalsFromCollectionId));
// router.get("/:id/content", auth, asyncMiddleware(getOrdinalContent));

export { router as adminOrdinalsRouter };
