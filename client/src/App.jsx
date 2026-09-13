
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyEmail from "./pages/VerifyEmail";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import MyOrders from "./pages/MyOrders";
import OrderDetails from "./pages/OrderDetails";
import CustomPizza from "./pages/CustomPizza";

import AdminDashboard from "./pages/AdminDashboard.jsx";
import AdminOrders from "./pages/AdminOrders";
import AdminProducts from "./pages/AdminProducts";
import AdminUsers from "./pages/AdminUsers";

import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import { CartProvider } from "./context/CartContext";


import AdminInventory from "./pages/AdminInventory";
import AdminLogin from "./pages/AdminLogin"; 

// PROFILE PAGE
function Profile() {
  return (
    <div>
      <h1>Profile</h1>
      <p>You are logged in.</p>
    </div>
  );
}

// APP
function App() {
  return (
    <CartProvider>
      <BrowserRouter>

        {/* NAVBAR */}
        <Navbar />

        <Routes>

          {/* ================================
              PUBLIC ROUTES
          ================================= */}

          <Route
            path="/"
            element={<Login />}
          />

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/admin/login"
            element={<AdminLogin />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

          <Route
            path="/verify-email/:token"
            element={<VerifyEmail />}
          />

          <Route
            path="/forgot-password"
            element={<ForgotPassword />}
          />

          <Route
            path="/reset-password/:token"
            element={<ResetPassword />}
          />


          {/* ================================
              NORMAL USER PROTECTED ROUTES
          ================================= */}

          <Route element={<ProtectedRoute />}>

            <Route
              path="/profile"
              element={<Profile />}
            />

            <Route
              path="/dashboard"
              element={<Dashboard />}
            />

            <Route
              path="/cart"
              element={<Cart />}
            />

            <Route
              path="/checkout"
              element={<Checkout />}
            />

            <Route
              path="/order-success"
              element={<OrderSuccess />}
            />

            <Route
              path="/my-orders"
              element={<MyOrders />}
            />

            <Route
              path="/orders/:id"
              element={<OrderDetails />}
            />

            <Route
              path="/custom-pizza"
              element={<CustomPizza />}
            />

          </Route>


          {/* ================================
              ADMIN ONLY ROUTES
          ================================= */}

          <Route
            element={
              <ProtectedRoute adminOnly={true} />
            }
          >

            {/* Admin Dashboard */}

            <Route
              path="/admin"
              element={<AdminDashboard />}
            />

            <Route
              path="/admin/dashboard"
              element={<AdminDashboard />}
            />




            {/* Admin Orders */}

            <Route
              path="/admin/orders"
              element={<AdminOrders />}
            />


            {/* Admin Products */}

            <Route
              path="/admin/products"
              element={<AdminProducts />}
            />


            {/* Admin Users */}
            <Route
              path="/admin/users"
              element={<AdminUsers />}
            />


            {/* Admin Inventory */}
            <Route
              path="/admin/inventory"
              element={<AdminInventory />}
            />


          </Route>

        </Routes>

      </BrowserRouter>
    </CartProvider>
  );
}

export default App;

