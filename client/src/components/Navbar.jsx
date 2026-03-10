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
    <nav className="ad-navbar">
      <div className="container d-flex align-items-center">
        {/* Brand */}
        <Link
          className="ad-brand me-4"
          to={!isAuthed ? "/" : isAdmin ? "/admin" : isSeller ? "/my-listings" : "/"}
        >
          <i className="bi bi-gear-wide-connected ad-brand-icon" />
          AutoDecar
        </Link>

        {/* Nav links */}
        <ul className="navbar-nav flex-row align-items-center gap-1 me-auto d-none d-md-flex">
          <li className="nav-item">
            <NavLink to="/" end className={navLinkClass}>Home</NavLink>
          </li>
          {isAuthed && isBuyer && (
            <>
              <li className="nav-item">
                <NavLink to="/my-enquiries" className={navLinkClass}>Enquiries</NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/my-bids" className={navLinkClass}>My Bids</NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/my-orders" className={navLinkClass}>Orders</NavLink>
              </li>
            </>
          )}
          {isAuthed && isSeller && (
            <>
              <li className="nav-item">
                <NavLink to="/my-listings" className={navLinkClass}>My Listings</NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/received-enquiries" className={navLinkClass}>Enquiries</NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/seller-deliveries" className={navLinkClass}>Deliveries</NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/seller-damage-reports" className={navLinkClass}>Damage</NavLink>
              </li>
            </>
          )}
          {isAuthed && isAdmin && (
            <li className="nav-item">
              <NavLink to="/admin" className={navLinkClass}>Admin</NavLink>
            </li>
          )}
        </ul>

        {/* Right side: icons + auth */}
        <div className="d-flex align-items-center gap-2 ms-auto">
          {isAuthed && isBuyer && (
            <>
              <Link to="/compare" className="ad-nav-icon" title="Compare">
                <i className="bi bi-search" />
              </Link>
              <Link to="/favorites" className="ad-nav-icon" title="Favorites">
                <i className="bi bi-heart" />
              </Link>
            </>
          )}

          {!isAuthed ? (
            <div className="d-flex align-items-center gap-2">
              <NavLink to="/login" className={navLinkClass}>
                <i className="bi bi-person me-1" />Login / Register
              </NavLink>
            </div>
          ) : (
            <>
              {isSeller && (
                <Link to="/create-listing" className="ad-btn-add-listing">
                  <i className="bi bi-camera" />
                  Add listing
                </Link>
              )}
              <div className="nav-item dropdown">
                <button
                  className="btn btn-link nav-link dropdown-toggle text-decoration-none d-flex align-items-center"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  style={{ color: "#fff" }}
                >
                  {user?.name}
                  <span className="badge bg-light ms-2 small">{user?.role}</span>
                </button>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <Link to="/me" className="dropdown-item">
                      <i className="bi bi-person-circle me-2" />Profile
                    </Link>
                  </li>
                  <li><hr className="dropdown-divider" style={{ borderColor: "rgba(255,255,255,0.1)" }} /></li>
                  <li>
                    <button type="button" className="dropdown-item text-danger" onClick={handleLogout}>
                      <i className="bi bi-box-arrow-right me-2" />Logout
                    </button>
                  </li>
                </ul>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
