
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

function ProtectedRoute({ adminOnly = false }) {
  const { isAuthenticated, loading, user } = useAuth();

  // Loading
  if (loading) {
    return <p>Loading...</p>;
  }

  // Login nahi hai
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // TEMPORARY DEBUG
  console.log("PROTECTED ROUTE:", {
    adminOnly,
    user,
    role: user?.role
  });

  // Admin-only route
  if (adminOnly && user?.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  // Access allowed
  return <Outlet />;
}

export default ProtectedRoute;

