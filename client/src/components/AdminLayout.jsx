import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { to: "/admin", end: true, icon: "bi-grid", label: "Overview" },
  { to: "/admin/users", icon: "bi-people", label: "Users" },
  { to: "/admin/cars", icon: "bi-car-front", label: "Listings" },
  { to: "/admin/enquiries", icon: "bi-chat-left-text", label: "Enquiries" },
  { to: "/admin/bids", icon: "bi-hammer", label: "Bids" },
  { to: "/admin/payments", icon: "bi-credit-card", label: "Payments" },
  { to: "/admin/deliveries", icon: "bi-truck", label: "Deliveries" },
  { to: "/admin/damage-reports", icon: "bi-exclamation-triangle", label: "Damage Reports" },
];

function navLinkClass({ isActive }) {
  return `admin-nav-item${isActive ? " active" : ""}`;
}

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  const initials = (user?.name || "A")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="admin-dashboard-wrapper">
      <aside className="admin-sidebar">
        {/* Brand */}
        <div className="admin-sidebar-header">
          <Link to="/admin" className="admin-sidebar-brand">
            <i className="bi bi-gear-wide-connected" />
            AutoDecar
          </Link>
        </div>

        {/* Section label */}
        <div className="admin-sidebar-label">Management</div>

        {/* Nav */}
        <nav className="admin-sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={navLinkClass}
            >
              <i className={`bi ${item.icon}`} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="admin-sidebar-footer">
          <div className="admin-user-info">
            <div className="admin-user-avatar">{initials}</div>
            <div className="admin-user-meta">
              <div className="admin-user-name">{user?.name}</div>
              <div className="admin-user-role">{user?.role}</div>
            </div>
          </div>

          <Link to="/" className="admin-sidebar-back">
            <i className="bi bi-arrow-left" /> Back to site
          </Link>

          <button
            type="button"
            className="btn btn-outline-danger btn-sm w-100 mt-2"
            onClick={handleLogout}
          >
            <i className="bi bi-box-arrow-right me-1" />
            Logout
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}
