import { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../services/authService";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    try {
      const data = await forgotPassword(email);

      setMessage(data.message || "Password reset link sent.");
      setEmail("");
    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Something went wrong"
      );
    }
  };

  return (
    <div>
      <h1>Forgot Password</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <br />
        <br />

        <button type="submit">
          Send Reset Link
        </button>
      </form>

      {message && <p>{message}</p>}
      {error && <p>{error}</p>}

      <Link to="/login">
        Back to Login
      </Link>
    </div>
  );
}

export default ForgotPassword;