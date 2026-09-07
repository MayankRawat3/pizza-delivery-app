import express from "express";

console.log("🔥 USER ROUTES LOADED");

import {
  getAllUsers,
  updateUserRole,
  updateUserStatus,
  deleteUser
} from "../controllers/userController.js";

import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";

const router = express.Router();


// ==========================================
// ADMIN - GET ALL USERS
// ==========================================

router.get(
  "/admin/all",
  protect,
  adminOnly,
  getAllUsers
);




// ==========================================
// ADMIN - UPDATE USER ROLE
// ==========================================

console.log("🔥 REGISTERING ROLE PATCH ROUTE");

router.patch(
  "/admin/:id/role",
  protect,
  adminOnly,
  updateUserRole
);


console.log("🔥 ROLE PATCH ROUTE REGISTERED");


// ==========================================
// ADMIN - ACTIVATE / DEACTIVATE USER
// ==========================================

router.patch(
  "/admin/:id/status",
  protect,
  adminOnly,
  updateUserStatus
);


// ==========================================
// ADMIN - DELETE USER
// ==========================================

router.delete(
  "/admin/:id",
  protect,
  adminOnly,
  deleteUser
);


export default router;

