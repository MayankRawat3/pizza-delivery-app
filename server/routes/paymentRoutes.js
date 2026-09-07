import express from "express";

import {
  createOrder,
  verifyPayment,
} from "../controllers/paymentController.js";

const router = express.Router();

console.log("✅ PAYMENT ROUTES FILE LOADED");

router.post("/create-order", (req, res, next) => {
  console.log("✅ CREATE ORDER ROUTE HIT");
  next();
}, createOrder);

router.post("/verify-payment", verifyPayment);

export default router;