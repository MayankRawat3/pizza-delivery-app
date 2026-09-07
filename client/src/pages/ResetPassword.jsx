import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { resetPassword } from "../services/authService";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const data = await resetPassword(token, password);

      setMessage(
        data.message || "Password reset successfully"
      );

      setPassword("");
      setConfirmPassword("");

      // 2 seconds ke baad login page
      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Password reset failed"
      );
    }
  };

  return (
    <div>
      <h1>Reset Password</h1>

      <form onSubmit={handleSubmit}>

        <div>
          <label>New Password</label>
          <br />

          <input
            type="password"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
        </div>

        <br />

        <div>
          <label>Confirm Password</label>
          <br />

          <input
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(e.target.value)
            }
            required
            minLength={6}
          />
        </div>

        <br />

        <button type="submit">
          Reset Password
        </button>

      </form>

      {message && <p>{message}</p>}

      {error && <p>{error}</p>}

      <br />

      <Link to="/login">
        Back to Login
      </Link>
    </div>
  );
}

export default ResetPassword;