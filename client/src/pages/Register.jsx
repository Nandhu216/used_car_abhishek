import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiFetch } from "../api/client";
import { useAuth } from "../context/AuthContext";

const CAR_IMAGE =
  "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=800&q=80";

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("buyer");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await apiFetch("/auth/register", {
        method: "POST",
        body: { name, phoneNumber, email, password, role },
      });
      login({ token: data.token, user: data.user });
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="ad-auth-page">
      <div className="ad-auth-card">
        {/* Left — image */}
        <div className="ad-auth-image">
          <img src={CAR_IMAGE} alt="Sports car" />
        </div>

        {/* Right — form */}
        <div className="ad-auth-form-side">
          <div className="ad-auth-brand">
            <i className="bi bi-gear-wide-connected" />
            <span>AutoDecar</span>
          </div>

          <h2 className="ad-auth-title">Create your account</h2>
          <p className="ad-auth-subtitle">
            Enter your details to get started
          </p>

          {error && (
            <div className="alert alert-danger py-2 small" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={onSubmit}>
            <div className="mb-3">
              <label htmlFor="reg-name" className="form-label">
                Name
              </label>
              <div className="ad-auth-input-wrap">
                <input
                  id="reg-name"
                  type="text"
                  className="form-control"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoComplete="name"
                />
                <span className="ad-auth-input-icon">
                  <i className="bi bi-person" />
                </span>
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="reg-phone" className="form-label">
                Phone{" "}
                <span className="text-muted-app small">(optional)</span>
              </label>
              <div className="ad-auth-input-wrap">
                <input
                  id="reg-phone"
                  type="tel"
                  className="form-control"
                  placeholder="Enter your phone number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  autoComplete="tel"
                />
                <span className="ad-auth-input-icon">
                  <i className="bi bi-telephone" />
                </span>
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="reg-email" className="form-label">
                Email
              </label>
              <div className="ad-auth-input-wrap">
                <input
                  id="reg-email"
                  type="email"
                  className="form-control"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
                <span className="ad-auth-input-icon">
                  <i className="bi bi-envelope" />
                </span>
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="reg-role" className="form-label">
                Role
              </label>
              <select
                id="reg-role"
                className="form-select"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="buyer">Buyer</option>
                <option value="seller">Seller</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className="mb-4">
              <label htmlFor="reg-password" className="form-label">
                Password
              </label>
              <div className="ad-auth-input-wrap">
                <input
                  id="reg-password"
                  type={showPassword ? "text" : "password"}
                  className="form-control"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="ad-auth-input-icon ad-auth-toggle-pw"
                  onClick={() => setShowPassword((p) => !p)}
                  aria-label={
                    showPassword ? "Hide password" : "Show password"
                  }
                  tabIndex={-1}
                >
                  <i
                    className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}
                  />
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100 ad-auth-btn"
              disabled={loading}
            >
              {loading ? "Creating\u2026" : "Create account"}
            </button>
          </form>

          <p className="ad-auth-switch">
            Already have an account?{" "}
            <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
