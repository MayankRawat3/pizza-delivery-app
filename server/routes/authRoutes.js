import express from "express";

import {
  register,
  login,
  verifyEmail,
  resendVerificationEmail,
  forgotPassword,
  resetPassword
} from "../controllers/authController.js";

import {
  protect
} from "../middleware/authMiddleware.js";

const router = express.Router();


// ========================================
// REGISTER
// ========================================

router.post(
  "/register",
  register
);


// ========================================
// LOGIN
// ========================================

router.post(
  "/login",
  login
);


// ========================================
// VERIFY EMAIL
// ========================================

router.get(
  "/verify-email/:token",
  verifyEmail
);


// ========================================
// RESEND VERIFICATION EMAIL
// ========================================

router.post(
  "/resend-verification",
  resendVerificationEmail
);


// ========================================
// FORGOT PASSWORD
// ========================================

router.post(
  "/forgot-password",
  forgotPassword
);


// ========================================
// RESET PASSWORD
// ========================================

router.post(
  "/reset-password/:token",
  resetPassword
);


// ========================================
// PROTECTED PROFILE
// ========================================

router.get(
  "/profile",
  protect,
  (req, res) => {
    res.json({
      message: "Profile accessed successfully",
      user: req.user
    });
  }
);


export default router;