import express from "express";

import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from "../controllers/productController.js";

import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";

const router = express.Router();


// GET ALL PRODUCTS
// Public
router.get("/", getProducts);


// GET SINGLE PRODUCT
// Public
router.get("/:id", getProductById);


// CREATE PRODUCT
// Admin only
router.post(
  "/",
  protect,
  adminOnly,
  createProduct
);


// UPDATE PRODUCT
// Admin only
router.put(
  "/:id",
  protect,
  adminOnly,
  updateProduct
);


// DELETE PRODUCT
// Admin only
router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteProduct
);


export default router;