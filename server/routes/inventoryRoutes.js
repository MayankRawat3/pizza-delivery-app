import express from "express";

import {
  getInventory,
  getInventoryItem,
  createInventoryItem,
  updateInventoryStock,
  deleteInventoryItem,
  checkInventoryBeforePayment
} from "../controllers/inventoryController.js";

import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";

const router = express.Router();

// ==========================================
// GET ALL INVENTORY
// ==========================================

router.post(
  "/check",
  protect,
  checkInventoryBeforePayment
);


router.get(
  "/",
  protect,
  adminOnly,
  getInventory
);

// ==========================================
// GET SINGLE INVENTORY ITEM
// ==========================================

router.post(
  "/check",
  protect,
  adminOnly,
  checkInventoryBeforePayment
);


router.get(
  "/:id",
  protect,
  adminOnly,
  getInventoryItem
);

// ==========================================
// CREATE INVENTORY ITEM
// ==========================================

router.post(
  "/",
  protect,
  adminOnly,
  createInventoryItem
);

// ==========================================
// UPDATE INVENTORY
// ==========================================

router.patch(
  "/:id",
  protect,
  adminOnly,
  updateInventoryStock
);

// ==========================================
// DELETE INVENTORY ITEM
// ==========================================

router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteInventoryItem
);

export default router;