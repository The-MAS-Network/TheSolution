import { Router } from "express";

import { auth } from "../middlewares/auth";
import { asyncMiddleware } from "../middlewares/utility";
import {
  createCollection,
  deleteCollection,
  getAllCollections,
  getTotalOrdinalsInACollection,
  toggleOrdinalCollectionStatus,
} from "../controllers/ordinalCollections";

const router = Router();

router.get("/", auth, asyncMiddleware(getAllCollections));
router.post("/", auth, asyncMiddleware(createCollection));
router.get(
  "/total-ordinals/:id",
  auth,
  asyncMiddleware(getTotalOrdinalsInACollection)
);
router.delete("/:id", auth, asyncMiddleware(deleteCollection));
router.patch("/:id", auth, asyncMiddleware(toggleOrdinalCollectionStatus));

export { router as ordinalCollectionsRouter };
