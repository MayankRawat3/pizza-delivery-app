import dotenv from "dotenv";
import express from "express";
import cors from "cors";

import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import inventoryRoutes from "./routes/inventoryRoutes.js";
import startInventoryCron from "./services/inventoryCron.js";
// ========================================
// LOAD ENVIRONMENT VARIABLES
// ========================================

dotenv.config();

// ========================================
// CHECK ENVIRONMENT VARIABLES
// ========================================

console.log(
  "EMAIL_USER exists:",
  !!process.env.EMAIL_USER
);

console.log(
  "EMAIL_USER:",
  process.env.EMAIL_USER
);

// ========================================
// CREATE EXPRESS APP
// ========================================

const app = express();

// ========================================
// MIDDLEWARE
// ========================================

app.use(cors());

app.use(express.json());

// ========================================
// DATABASE CONNECTION
// ========================================

connectDB();

// ========================================
// AUTH ROUTES
// ========================================

app.use(
  "/api/auth",
  authRoutes
);

// ========================================
// PRODUCT ROUTES
// ========================================

app.use(
  "/api/products",
  productRoutes
);

// ========================================
// ORDER ROUTES
// ========================================

app.use(
  "/api/orders",
  orderRoutes
);

// ========================================
// PAYMENT ROUTES
// ========================================

app.use(
  "/api/payment",
  paymentRoutes
);



// ========================================
// ADMIN ROUTES
// ========================================

app.use(
  "/api/admin",
  adminRoutes
);

// ========================================
// USER ROUTES
// ========================================


app.use(
  "/api/users",
  userRoutes
);


// ========================================
// INVENTORY ROUTES
// ========================================

app.use(
  "/api/inventory",
  inventoryRoutes
);



// ========================================
// ROOT ROUTE
// ========================================

app.get(
  "/",
  (req, res) => {
    res.json({
      message: "Pizza Delivery API is running"
    });
  }
);

// ========================================
// SERVER
// ========================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  startInventoryCron();
});