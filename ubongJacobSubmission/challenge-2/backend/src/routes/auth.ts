import { Router } from "express";

import { asyncMiddleware } from "../middlewares/utility";
import {
  verifyLightningAddress,
  login,
  registerUser,
  getProfile,
  editProfile,
  verifyDualAmounts,
  getMaxTrialCount,
  changePassword,
} from "../controllers/user";
import { auth } from "../middlewares/auth";

const router = Router();

// LOGIN USER
router.post("/login", asyncMiddleware(login));

router.post("/register", asyncMiddleware(registerUser));
router.post(
  "/verify-lightning-address",
  asyncMiddleware(verifyLightningAddress)
);

router.get("/profile", auth, asyncMiddleware(getProfile));
router.patch("/profile", auth, asyncMiddleware(editProfile));
router.patch("/verify-dual-amounts", asyncMiddleware(verifyDualAmounts));
router.get("/get-max-trial-count", asyncMiddleware(getMaxTrialCount));
router.patch("/change-password", auth, asyncMiddleware(changePassword));

export { router as userAuth };
