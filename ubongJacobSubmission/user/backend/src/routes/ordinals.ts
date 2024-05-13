import { Router } from "express";

import { getOrdinalsFromWalletAddress } from "../controllers/ordinals";
import { auth } from "../middlewares/auth";
import { asyncMiddleware } from "../middlewares/utility";

const router = Router();

router.get("/wallet/:id", auth, asyncMiddleware(getOrdinalsFromWalletAddress));

export { router as ordinalRouter };
