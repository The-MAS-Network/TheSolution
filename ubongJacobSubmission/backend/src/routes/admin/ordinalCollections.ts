import { Router } from "express";

import {
  createCollection,
  deleteCollection,
  getAllCollections,
  getOrdinalsInCollectionByLightningAddress,
  getTotalOrdinalsInACollection,
  toggleOrdinalCollectionStatus,
} from "../../controllers/admin/ordinalCollections";
import { adminAuth } from "../../middlewares/auth";
import { asyncMiddleware } from "../../middlewares/utility";

const router = Router();

router.get("/", adminAuth, asyncMiddleware(getAllCollections));
router.post("/", adminAuth, asyncMiddleware(createCollection));
router.get(
  "/total-ordinals/:id",
  adminAuth,
  asyncMiddleware(getTotalOrdinalsInACollection)
);
router.get(
  "/lightning",
  adminAuth,
  asyncMiddleware(getOrdinalsInCollectionByLightningAddress)
);
router.delete("/:id", adminAuth, asyncMiddleware(deleteCollection));
router.patch("/:id", adminAuth, asyncMiddleware(toggleOrdinalCollectionStatus));

export { router as adminOrdinalCollectionsRouter };
