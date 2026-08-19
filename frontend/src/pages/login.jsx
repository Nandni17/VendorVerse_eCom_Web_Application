import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import API from "../api/axios";
import { AuthContext } from "../context/authContext";

function Login() {
  const navigate = useNavigate();

  const { login } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const response = await API.post(
        "/api/auth/login",
        formData
      );

      console.log("Login response:", response.data);

      const userData = {
        token: response.data.token,
        ...response.data.user,
      };

      // Store user + JWT
      login(userData);

      if (userData.role === "admin") {
        navigate("/admin");
      } else if (userData.role === "seller") {
        navigate("/seller");
      } else {
        navigate("/");
      }

    } catch (err) {
      console.error("Login error:", err);

      setError(
        err.response?.data?.message ||
        "Login failed. Please try again."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">

      <div className="auth-card">

        <h1>
          Login 
        </h1>

        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <div className="form-group">

            <label>
              Email Address
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />

          </div>

          <div className="form-group">

            <label>
              Password
            </label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />

          </div>

          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>

        </form>

        <p className="auth-switch">

          Don't have an account?

          {" "}

          <Link to="/register">
            Register
          </Link>

        </p>

      </div>

    </main>
  );
}

export default Login;