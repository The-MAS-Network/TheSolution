import { Router } from "express";

import {
  changePassword,
  generateOtp,
  login,
  resetPassword,
  verifyOTP,
} from "../controllers/auth";
// import { auth } from "../middlewares/auth";
import { asyncMiddleware } from "../middlewares/utility";
import { secondaryAuth } from "../middlewares/auth";

const router = Router();

router.post("/login", asyncMiddleware(login));

router.post("/generate-otp", asyncMiddleware(generateOtp));

router.post("/verify-otp", asyncMiddleware(verifyOTP));
router.post("/reset-password", secondaryAuth, asyncMiddleware(resetPassword));
router.post("/change-password", secondaryAuth, asyncMiddleware(changePassword));

// router.get("/profile", auth, asyncMiddleware(getProfile));

export { router as userAuth };
