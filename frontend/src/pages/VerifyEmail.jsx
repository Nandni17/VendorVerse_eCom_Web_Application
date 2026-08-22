import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import API from "../api/axios";

function VerifyEmail() {

  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState(
    location.state?.email || ""
  );

  const [code, setCode] = useState("");

  const [error, setError] = useState("");

  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);

  const [resending, setResending] = useState(false);


  // =========================
  // VERIFY OTP
  // =========================

  const handleVerify = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);
      setError("");
      setMessage("");

      const response = await API.post(
        "/api/auth/verify-email",
        {
          email,
          code,
        }
      );

      setMessage(
        response.data.message
      );

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (err) {

      console.error(
        "Verification error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Verification failed."
      );

    } finally {

      setLoading(false);

    }
  };


  // =========================
  // RESEND OTP
  // =========================

  const handleResend = async () => {

    try {

      setResending(true);
      setError("");
      setMessage("");

      const response = await API.post(
        "/api/auth/resend-verification",
        {
          email,
        }
      );

      setMessage(
        response.data.message
      );

    } catch (err) {

      console.error(
        "Resend OTP error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to resend code."
      );

    } finally {

      setResending(false);

    }
  };


  return (

    <main className="auth-page">

      <div className="auth-card">

        <h1>
          Verify Your Email
        </h1>

        <p>
          We sent a 6-digit verification
          code to your email.
        </p>


        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}


        {message && (
          <div className="auth-success">
            {message}
          </div>
        )}


        <form
          onSubmit={handleVerify}
        >

          <div className="form-group">

            <label>
              Email Address
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              placeholder="Enter your email"
              required
            />

          </div>


          <div className="form-group">

            <label>
              Verification Code
            </label>

            <input
              type="text"
              value={code}
              onChange={(e) =>
                setCode(
                  e.target.value
                    .replace(/\D/g, "")
                    .slice(0, 6)
                )
              }
              placeholder="Enter 6-digit code"
              maxLength="6"
              inputMode="numeric"
              required
            />

          </div>


          <button
            type="submit"
            className="auth-button"
            disabled={
              loading ||
              code.length !== 6
            }
          >

            {loading
              ? "Verifying..."
              : "Verify Email"}

          </button>

        </form>


        <button
          type="button"
          className="auth-button"
          onClick={handleResend}
          disabled={
            resending ||
            !email
          }
          style={{
            marginTop: "12px",
          }}
        >

          {resending
            ? "Sending..."
            : "Resend Code"}

        </button>


        <p className="auth-switch">

          Already verified?

          {" "}

          <Link to="/login">
            Login
          </Link>

        </p>

      </div>

    </main>
  );
}

export default VerifyEmail;