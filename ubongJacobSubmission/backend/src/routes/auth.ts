import { Router } from "express";

import { asyncMiddleware } from "../middlewares/utility";
import {
  verifyLightningAddress,
  getAllUsers,
  login,
  registerUser,
  getProfile,
  editProfile,
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

router.get("/all", asyncMiddleware(getAllUsers));
router.get("/profile", auth, asyncMiddleware(getProfile));
router.patch("/profile", auth, asyncMiddleware(editProfile));

export { router as userAuth };
