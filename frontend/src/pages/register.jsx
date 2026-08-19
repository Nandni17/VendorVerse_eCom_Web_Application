import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import API from "../api/axios";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "buyer",
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

      const response = await API.post("/api/auth/register", {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role,
    });

      alert("Registration successful! Please login.");

      navigate("/login");

    } catch (err) {
      console.error("Registration error:", err);

      setError(
        err.response?.data?.message ||
        "Registration failed."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">

      <div className="auth-card">

        <h1>
          Create Account
        </h1>

        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <div className="form-group">

            <label>
              Full Name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              required
            />

          </div>

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
              placeholder="Create a password"
              minLength="6"
              required
            />

          </div>

          <div className="auth-group">

  <label>
    Account Type
  </label>

  <select
    name="role"
    value={formData.role}
    onChange={handleChange}
  >
    <option value="buyer">
      Customer
    </option>

    <option value="seller">
      Seller
    </option>
  </select>

</div>

          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >
            {loading
              ? "Creating Account..."
              : "Create Account"}
          </button>

        </form>

        <p className="auth-switch">

          Already have an account?

          {" "}

          <Link to="/login">
            Login
          </Link>

        </p>

      </div>

    </main>
  );
}

export default Register;