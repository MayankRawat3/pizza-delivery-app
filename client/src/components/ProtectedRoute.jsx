
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

  

  // Admin-only route
  if (adminOnly && user?.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  // Access allowed
  return <Outlet />;
}

export default ProtectedRoute;

