import {
  checkoutSessionWeb,
  getPublishableKey,
  paymentSheet,
  sessionStatus,
} from "../controllers/payments.js";
import express from "express";

const router = express.Router();
router.get("/publishablekey", getPublishableKey);
router.post("/paymentsheet", paymentSheet);
router.post("/checkoutSessionWeb", checkoutSessionWeb);
router.get("/sessionStatus", sessionStatus);
export default router;
