import { Router } from "express";
import { createInvoice, verifyInvoice } from "../controllers/payment";
import { asyncMiddleware } from "../middlewares/utility";

const router = Router();

router.post("/", asyncMiddleware(createInvoice));
router.patch("/", asyncMiddleware(verifyInvoice));
// router.get("/single/:id", asyncMiddleware(getInvoice));
// router.get("/payout", asyncMiddleware(sendPayments));

export { router as paymentRouter };
