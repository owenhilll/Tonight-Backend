import {
  checkoutSessionWeb,
  getPublishableKey,
  paymentSheet,
} from "../controllers/payments.js";
import express from "express";

const router = express.Router();
router.get("/publishablekey", getPublishableKey);
router.post("/paymentsheet", paymentSheet);
router.post("/checkoutSessionWeb", checkoutSessionWeb);

export default router;
