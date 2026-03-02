import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { isAuthed, isAdmin, isBuyer, isSeller, user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  const navLinkClass = ({ isActive }) =>
    `nav-link ${isActive ? "active" : ""}`.trim();

  return (
    <nav className="navbar navbar-expand-md navbar-dark bg-primary shadow-sm">
      <div className="container">
        <Link className="navbar-brand fw-semibold" to="/">
          Used Car Marketplace
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarMain"
          aria-controls="navbarMain"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarMain">
          <ul className="navbar-nav ms-auto align-items-md-center gap-1 gap-md-2">
            {!isAuthed ? (
              <>
                <li className="nav-item">
                  <NavLink to="/login" className={navLinkClass}>
                    Login
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/register" className={navLinkClass}>
                    Register
                  </NavLink>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <NavLink to="/" end className={navLinkClass}>
                    Browse
                  </NavLink>
                </li>
                {/* Seller & Admin: Can create listings */}
                {(isSeller || isAdmin) && (
                  <>
                    <li className="nav-item">
                      <NavLink to="/create-listing" className={navLinkClass}>
                        Sell
                      </NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink to="/my-listings" className={navLinkClass}>
                        My Listings
                      </NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink to="/received-enquiries" className={navLinkClass}>
                        Enquiries
                      </NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink to="/received-bids" className={navLinkClass}>
                        Bids
                      </NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink to="/seller-deliveries" className={navLinkClass}>
                        Deliveries
                      </NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink to="/seller-damage-reports" className={navLinkClass}>
                        Damage
                      </NavLink>
                    </li>
                  </>
                )}
                {/* All authenticated: Can send enquiries */}
                <li className="nav-item">
                  <NavLink to="/my-enquiries" className={navLinkClass}>
                    My Enquiries
                  </NavLink>
                </li>
                {(isBuyer || isSeller) && (
                  <>
                    <li className="nav-item">
                      <NavLink to="/my-bids" className={navLinkClass}>
                        My Bids
                      </NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink to="/my-orders" className={navLinkClass}>
                        My Orders
                      </NavLink>
                    </li>
                  </>
                )}
                {/* Buyer & Seller: Favorites & Compare */}
                {(isBuyer || isSeller) && (
                  <>
                    <li className="nav-item">
                      <NavLink to="/favorites" className={navLinkClass}>
                        Favorites
                      </NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink to="/compare" className={navLinkClass}>
                        Compare
                      </NavLink>
                    </li>
                  </>
                )}
                <li className="nav-item">
                  <NavLink to="/me" className={navLinkClass}>
                    Profile
                  </NavLink>
                </li>
                {/* Admin: Admin dashboard */}
                {isAdmin && (
                  <li className="nav-item">
                    <NavLink to="/admin" className={navLinkClass}>
                      Admin
                    </NavLink>
                  </li>
                )}
                <li className="nav-item dropdown">
                  <button
                    className="btn btn-link nav-link dropdown-toggle text-white text-decoration-none d-flex align-items-center"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    {user?.name} <span className="badge bg-light text-dark ms-2 small">{user?.role}</span>
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end">
                    <li>
                      <button
                        type="button"
                        className="dropdown-item text-danger"
                        onClick={handleLogout}
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
