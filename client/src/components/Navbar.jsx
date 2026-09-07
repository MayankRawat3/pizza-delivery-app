import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";

function Navbar() {
  const navigate = useNavigate();

  const {
    user,
    isAuthenticated,
    logout
  } = useAuth();

  const {
    cartItemCount
  } = useCart();

  // ========================================
  // LOGOUT
  // ========================================

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav>

      {/* ========================================
          LOGO
      ======================================== */}

      <Link
        to={isAuthenticated ? "/dashboard" : "/login"}
      >
        🍕 Pizza Delivery
      </Link>

      {" | "}

      {/* ========================================
          AUTHENTICATED NAVIGATION
      ======================================== */}

      {isAuthenticated ? (
        <>
          <Link to="/dashboard">
            Menu
          </Link>

          {" | "}

          <Link to="/cart">
            🛒 Cart ({cartItemCount})
          </Link>

          {" | "}

          <Link to="/my-orders">
            My Orders
          </Link>

          {" | "}

          <Link to="/profile">
            Profile
          </Link>

          {" | "}

          <span>
            Welcome, {user?.name}
          </span>

          {" | "}

          <button onClick={handleLogout}>
            Logout
          </button>
        </>
      ) : (

        /* ========================================
           GUEST NAVIGATION
        ======================================== */

        <>
          <Link to="/login">
            Login
          </Link>

          {" | "}

          <Link to="/register">
            Register
          </Link>
        </>
      )}

    </nav>
  );
}

export default Navbar;
