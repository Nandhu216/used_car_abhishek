import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { apiFetch } from "../api/client";
import { useAuth } from "../context/AuthContext";

const CAR_IMAGE =
  "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=800&q=80";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await apiFetch("/auth/login", {
        method: "POST",
        body: { email, password },
      });
      login({ token: data.token, user: data.user });
      const role = data.user?.role;
      const to =
        role === "admin"
          ? "/admin"
          : role === "seller"
          ? location.state?.from || "/my-listings"
          : location.state?.from || "/";
      navigate(to, { replace: true });
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

          <h2 className="ad-auth-title">Sign In to your account</h2>
          <p className="ad-auth-subtitle">
            Enter your details to proceed further
          </p>

          {error && (
            <div className="alert alert-danger py-2 small" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={onSubmit}>
            <div className="mb-3">
              <label htmlFor="login-email" className="form-label">
                Email
              </label>
              <div className="ad-auth-input-wrap">
                <input
                  id="login-email"
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
              <label htmlFor="login-password" className="form-label">
                Your password
              </label>
              <div className="ad-auth-input-wrap">
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  className="form-control"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
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

            <div className="d-flex justify-content-between align-items-center mb-4">
              <div className="form-check">
                <input
                  id="remember-me"
                  type="checkbox"
                  className="form-check-input"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label
                  htmlFor="remember-me"
                  className="form-check-label small"
                >
                  Remember me
                </label>
              </div>
              <Link to="#" className="small text-decoration-none">
                Recover Password
              </Link>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100 ad-auth-btn"
              disabled={loading}
            >
              {loading ? "Signing in\u2026" : "Sign In"}
            </button>
          </form>

          <div className="ad-auth-divider">
            <span>Or</span>
          </div>

          <div className="ad-auth-social">
            <button type="button" className="ad-auth-social-btn">
              <i className="bi bi-google" /> Sign Up with Google
            </button>
            <button type="button" className="ad-auth-social-btn">
              <i className="bi bi-facebook" /> Sign Up with Facebook
            </button>
            <button type="button" className="ad-auth-social-btn">
              <i className="bi bi-twitter" /> Sign Up with Twitter
            </button>
          </div>

          <p className="ad-auth-switch">
            Don&apos;t have an account?{" "}
            <Link to="/register">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
