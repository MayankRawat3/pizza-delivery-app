import express from "express";

import {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  getAllOrders,
  updateOrderStatus
} from "../controllers/orderController.js";

import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";

const router = express.Router();


// ========================================
// ADMIN TEST
// ========================================

router.get(
  "/admin-test",
  protect,
  adminOnly,
  (req, res) => {
    res.json({
      message: "Admin access granted",
      user: req.user
    });
  }
);


// ========================================
// ADMIN - GET ALL ORDERS
// ========================================

router.get(
  "/admin/all",
  protect,
  adminOnly,
  getAllOrders
);


// ========================================
// ADMIN - UPDATE ORDER STATUS
// ========================================

router.patch(
  "/admin/:id/status",
  protect,
  adminOnly,
  updateOrderStatus
);


// ========================================
// CREATE ORDER
// ========================================

router.post(
  "/",
  protect,
  createOrder
);


// ========================================
// GET MY ORDERS
// ========================================

router.get(
  "/my-orders",
  protect,
  getMyOrders
);


// ========================================
// PATCH TEST
// ========================================

router.patch(
  "/patch-test",
  (req, res) => {
    res.json({
      message: "PATCH route is working"
    });
  }
);


// ========================================
// CANCEL ORDER
// ========================================

router.patch(
  "/:id/cancel",
  protect,
  cancelOrder
);


// ========================================
// GET SINGLE ORDER
// ========================================

router.get(
  "/:id",
  protect,
  getOrderById
);


export default router;