import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { loginUser } from "../services/authService";
import { useAuth } from "../context/AuthContext.jsx";

function Login() {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


  // ========================================
  // HANDLE INPUT CHANGE
  // ========================================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };


  // ========================================
  // HANDLE LOGIN
  // ========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");
    setLoading(true);

    try {
      const data = await loginUser(formData);

      // Save user + token through AuthContext
      login(data);

      setMessage(
        data.message || "Login successful"
      );

      // Redirect to protected profile


      if (data.user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/dashboard");
      }

    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Login failed"
      );

    } finally {
      setLoading(false);
    }
  };


  // ========================================
  // UI
  // ========================================

  return (
    <div>

      <h1>Login</h1>

      <form onSubmit={handleSubmit}>

        {/* EMAIL */}

        <div>
          <label>Email</label>
          <br />

          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <br />


        {/* PASSWORD */}

        <div>
          <label>Password</label>
          <br />

          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <br />


        {/* LOGIN BUTTON */}

        <button
          type="submit"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

      </form>


      {/* SUCCESS MESSAGE */}

      {message && (
        <p>{message}</p>
      )}


      {/* ERROR MESSAGE */}

      {error && (
        <p>{error}</p>
      )}


      {/* FORGOT PASSWORD */}

      <p>
        <Link to="/forgot-password">
          Forgot Password?
        </Link>
      </p>


      {/* REGISTER */}

      <p>
        Don't have an account?
      </p>

      <Link to="/register">
        Register
      </Link>

    </div>
  );
}

export default Login;