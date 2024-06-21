import { Router } from "express";
import {
  createInvoice,
  generateOnChainWalletAddress,
  getAllTimeLeaderboard,
  verifyInvoice,
} from "../controllers/payment";
import { asyncMiddleware } from "../middlewares/utility";
import { auth } from "../middlewares/auth";

const router = Router();

router.post("/", asyncMiddleware(createInvoice));
router.patch("/", asyncMiddleware(verifyInvoice));
router.post("/onchain", auth, asyncMiddleware(generateOnChainWalletAddress));
router.get("/leaderboard", auth, asyncMiddleware(getAllTimeLeaderboard));
// router.get("/single/:id", asyncMiddleware(getInvoice));
// router.get("/payout", asyncMiddleware(sendPayments));

export { router as paymentRouter };
