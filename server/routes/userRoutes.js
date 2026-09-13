import express from "express";


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


router.patch(
  "/admin/:id/role",
  protect,
  adminOnly,
  updateUserRole
);




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

