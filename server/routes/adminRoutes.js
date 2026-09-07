import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";

const router = express.Router();

router.get("/dashboard", protect, adminOnly, (req, res) => {
  res.json({
    message: "Welcome to Admin Dashboard",
    admin: req.user
  });
});

export default router;