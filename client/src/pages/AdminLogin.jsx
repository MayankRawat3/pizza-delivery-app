import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { loginUser } from "../services/authService";
import { useAuth } from "../context/AuthContext.jsx";

function AdminLogin() {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const data = await loginUser(formData);

      if (data.user.role !== "admin") {
        setError("Admin access denied");
        return;
      }

      login(data);

      navigate("/admin/dashboard");

    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Admin login failed"
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div>

      <h1>Admin Login 🛠️</h1>

      <form onSubmit={handleSubmit}>

        <div>
          <label>Admin Email</label>
          <br />

          <input
            type="email"
            name="email"
            placeholder="Enter admin email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <br />

        <div>
          <label>Password</label>
          <br />

          <input
            type="password"
            name="password"
            placeholder="Enter admin password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <br />

        <button
          type="submit"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Admin Login"}
        </button>

      </form>

      {error && (
        <p>{error}</p>
      )}

    </div>
  );
}

export default AdminLogin;