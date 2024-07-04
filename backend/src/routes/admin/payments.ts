import { Router } from "express";
import { adminAuth } from "../../middlewares/auth";
import { asyncMiddleware } from "../../middlewares/utility";
// import { verifyAndSendAdminPayments } from "../../controllers/old-payment";
import {
  generateTipOTP,
  getAllTipGroups,
  getOrdinalTipsByGroupId,
  tipCommunity,
  tipUser,
} from "../../controllers/admin/payment";

const router = Router();

router.post("/tip-user", adminAuth, asyncMiddleware(tipUser));
router.post("/tip-community", adminAuth, asyncMiddleware(tipCommunity));
router.post("/generate-otp", adminAuth, asyncMiddleware(generateTipOTP));
router.get("/", adminAuth, asyncMiddleware(getAllTipGroups));
router.get("/:id", adminAuth, asyncMiddleware(getOrdinalTipsByGroupId));

export { router as adminPaymentRouter };
