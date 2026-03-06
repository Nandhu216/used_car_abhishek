import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const navLinkClass = ({ isActive }) =>
  `list-group-item list-group-item-action border-0 rounded mb-1 ${isActive ? "active" : ""}`.trim();

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <div className="admin-dashboard-wrapper">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <span className="admin-sidebar-brand">Admin</span>
          <span className="badge bg-dark ms-2">Dashboard</span>
        </div>
        <nav className="admin-sidebar-nav">
          <NavLink to="/admin" end className={navLinkClass}>
            Overview
          </NavLink>
          <NavLink to="/admin/users" className={navLinkClass}>
            Users
          </NavLink>
          <NavLink to="/admin/cars" className={navLinkClass}>
            Listings
          </NavLink>
          <NavLink to="/admin/enquiries" className={navLinkClass}>
            Enquiries
          </NavLink>
          <NavLink to="/admin/bids" className={navLinkClass}>
            Bids
          </NavLink>
          <NavLink to="/admin/payments" className={navLinkClass}>
            Payments
          </NavLink>
          <NavLink to="/admin/deliveries" className={navLinkClass}>
            Deliveries
          </NavLink>
          <NavLink to="/admin/damage-reports" className={navLinkClass}>
            Damage Reports
          </NavLink>
        </nav>
        <div className="admin-sidebar-footer mt-auto">
          <div className="px-3 py-2 small text-muted">
            {user?.name} <span className="badge bg-secondary">{user?.role}</span>
          </div>
          <button
            type="button"
            className="btn btn-outline-danger btn-sm w-100"
            onClick={handleLogout}
          >
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
