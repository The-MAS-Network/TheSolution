import { Router } from "express";

import {
  createCollection,
  deleteCollection,
  getAllCollections,
  getOrdinalsInCollectionByLightningAddress,
  getTotalOrdinalsInACollection,
  rescanOrdinalsInCollection,
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
router.patch(
  "/status/:id",
  adminAuth,
  asyncMiddleware(toggleOrdinalCollectionStatus)
);
router.patch(
  "/rescan/:id",
  adminAuth,
  asyncMiddleware(rescanOrdinalsInCollection)
);

export { router as adminOrdinalCollectionsRouter };
