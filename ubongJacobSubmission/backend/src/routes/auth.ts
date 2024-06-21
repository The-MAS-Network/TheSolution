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
  getUserOrdinals,
  disconnectOrdinalWallet,
  verifyOrdinalTransaction,
  deleteAccount,
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

router.get("/profile/ordinals", auth, asyncMiddleware(getUserOrdinals));

router.patch(
  "/disconnect-wallet",
  auth,
  asyncMiddleware(disconnectOrdinalWallet)
);
router.patch("/profile", auth, asyncMiddleware(editProfile));

router.post("/delete-account", auth, asyncMiddleware(deleteAccount));

router.patch("/verify-dual-amounts", asyncMiddleware(verifyDualAmounts));

router.get("/get-max-trial-count", asyncMiddleware(getMaxTrialCount));

router.patch("/change-password", auth, asyncMiddleware(changePassword));

router.get(
  "/verify-ordinal-transaction",
  auth,
  asyncMiddleware(verifyOrdinalTransaction)
);

export { router as userRouter };
