import express from "express";

import {
  getInventory,
  getInventoryItem,
  createInventoryItem,
  updateInventoryStock,
  deleteInventoryItem,
  checkInventoryBeforePayment,
  getLowStockItems
} from "../controllers/inventoryController.js";

import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";

const router = express.Router();

// ==========================================
// CHECK INVENTORY BEFORE PAYMENT
// Customer can access this
// ==========================================

router.post(
  "/check",
  protect,
  checkInventoryBeforePayment
);



// ==========================================
// GET LOW STOCK ITEMS
// Admin only
// ==========================================

router.get(
  "/low-stock",
  protect,
  adminOnly,
  getLowStockItems
);

// ==========================================
// GET ALL INVENTORY
// Admin only
// ==========================================

router.get(
  "/",
  protect,
  adminOnly,
  getInventory
);

// ==========================================
// GET SINGLE INVENTORY ITEM
// Admin only
// ==========================================

router.get(
  "/:id",
  protect,
  adminOnly,
  getInventoryItem
);

// ==========================================
// CREATE INVENTORY ITEM
// Admin only
// ==========================================

router.post(
  "/",
  protect,
  adminOnly,
  createInventoryItem
);

// ==========================================
// UPDATE INVENTORY
// Admin only
// ==========================================

router.patch(
  "/:id",
  protect,
  adminOnly,
  updateInventoryStock
);

// ==========================================
// DELETE INVENTORY ITEM
// Admin only
// ==========================================

router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteInventoryItem
);



export default router;