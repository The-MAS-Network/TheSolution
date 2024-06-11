import { Router } from "express";

import { asyncMiddleware } from "../../middlewares/utility";
import { secondaryAuth } from "../../middlewares/auth";
import {
  changePassword,
  generateOtp,
  login,
  resetPassword,
  verifyOTP,
} from "../../controllers/admin";

const router = Router();

router.post("/auth/login", asyncMiddleware(login));

router.post("/auth/generate-otp", asyncMiddleware(generateOtp));

router.post("/auth/verify-otp", asyncMiddleware(verifyOTP));
router.post(
  "/auth/reset-password",
  secondaryAuth,
  asyncMiddleware(resetPassword)
);
router.post(
  "/auth/change-password",
  secondaryAuth,
  asyncMiddleware(changePassword)
);

export { router as adminRouter };
