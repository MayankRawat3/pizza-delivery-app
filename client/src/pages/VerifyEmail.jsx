import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { verifyEmail } from "../services/authService";

function VerifyEmail() {
  const { token } = useParams();

  const [message, setMessage] = useState("Verifying your email...");
  const [error, setError] = useState("");

  useEffect(() => {
    const verify = async () => {
      try {
        const data = await verifyEmail(token);

        setMessage(
          data.message || "Email verified successfully!"
        );
      } catch (error) {
        setError(
          error.response?.data?.message ||
          "Email verification failed"
        );
      }
    };

    if (token) {
      verify();
    } else {
      setError("Verification token is missing");
    }
  }, [token]);

  return (
    <div>
      <h1>Email Verification</h1>

      {!error && <p>{message}</p>}

      {error && <p>{error}</p>}

      <Link to="/login">
        Go to Login
      </Link>
    </div>
  );
}

export default VerifyEmail;