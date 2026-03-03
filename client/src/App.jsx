import { useState, useEffect } from "react";
import { Link, Route, Routes, Outlet } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { apiFetch } from "./api/client";
import Navbar from "./components/Navbar";
import AdminLayout from "./components/AdminLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RequireAuth from "./components/RequireAuth";
import RequireAdmin from "./components/RequireAdmin";
import RequireSeller from "./components/RequireSeller";
import Home from "./pages/Home";
import CarDetails from "./pages/CarDetails";
import CreateListing from "./pages/CreateListing";
import EditListing from "./pages/EditListing";
import MyListings from "./pages/MyListings";
import MyEnquiries from "./pages/MyEnquiries";
import MyBids from "./pages/MyBids";
import MyOrders from "./pages/MyOrders";
import ReceivedEnquiries from "./pages/ReceivedEnquiries";
import ReceivedBids from "./pages/ReceivedBids";
import SellerDeliveries from "./pages/SellerDeliveries";
import SellerDamageReports from "./pages/SellerDamageReports";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUserManagement from "./pages/AdminUserManagement";
import AdminPaymentManagement from "./pages/AdminPaymentManagement";
import Favorites from "./pages/Favorites";
import Compare from "./pages/Compare";

function MarketplaceLayout() {
  return (
    <>
      <Navbar />
      <main className="container py-4">
        <Outlet />
      </main>
    </>
  );
}

function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    setName(user?.name || "");
    setPhoneNumber(user?.phoneNumber || "");
  }, [user]);

  async function handleSave(e) {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setSaving(true);
    try {
      const data = await apiFetch("/auth/profile", {
        method: "PUT",
        auth: true,
        body: { name: name.trim(), phoneNumber: phoneNumber.trim() },
      });
      updateUser(data.user);
      setSuccess(true);
      setEditing(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleChangePassword(e) {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess(false);
    if (newPassword !== confirmPassword) {
      setPasswordError("New password and confirm password do not match.");
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters.");
      return;
    }
    setChangingPassword(true);
    try {
      await apiFetch("/auth/password", {
        method: "PUT",
        auth: true,
        body: { currentPassword, newPassword },
      });
      setPasswordSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setPasswordError(err.message);
    } finally {
      setChangingPassword(false);
    }
  }

  return (
    <>
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
        <h1 className="h4 mb-0">My profile</h1>
        <div className="d-flex gap-2">
          {!editing ? (
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => setEditing(true)}
            >
              Edit profile
            </button>
          ) : null}
          <Link to="/" className="btn btn-outline-secondary btn-sm">
            Back
          </Link>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      {success && (
        <div className="alert alert-success py-2 small" role="alert">
          Profile updated.
        </div>
      )}

      <div className="card">
        <div className="card-body">
          {editing ? (
            <>
              <form onSubmit={handleSave}>
                <div className="mb-3">
                  <label htmlFor="profile-name" className="form-label">
                    Name
                  </label>
                  <input
                    id="profile-name"
                    type="text"
                    className="form-control"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="text"
                    className="form-control bg-secondary bg-opacity-10"
                    value={user?.email || ""}
                    disabled
                    readOnly
                  />
                  <div className="form-text">Email cannot be changed.</div>
                </div>
                <div className="mb-3">
                  <label htmlFor="profile-phone" className="form-label">
                    Phone number
                  </label>
                  <input
                    id="profile-phone"
                    type="text"
                    className="form-control"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="e.g. 9876543210"
                  />
                </div>
                <div className="mb-2">
                  <label className="form-label">Role</label>
                  <span className="badge bg-primary ms-2">{user?.role}</span>
                  <div className="form-text">Role cannot be changed from profile.</div>
                </div>
                <div className="d-flex gap-2 mb-4">
                  <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? "Saving…" : "Save profile"}
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => {
                      setEditing(false);
                      setError("");
                      setPasswordError("");
                      setPasswordSuccess(false);
                      setName(user?.name || "");
                      setPhoneNumber(user?.phoneNumber || "");
                      setCurrentPassword("");
                      setNewPassword("");
                      setConfirmPassword("");
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>

              <hr className="my-4" />
              <h3 className="h6 mb-3">Change password</h3>
              {passwordError && (
                <div className="alert alert-danger py-2 small mb-3" role="alert">
                  {passwordError}
                </div>
              )}
              {passwordSuccess && (
                <div className="alert alert-success py-2 small mb-3" role="alert">
                  Password updated successfully.
                </div>
              )}
              <form onSubmit={handleChangePassword}>
                <div className="mb-3">
                  <label htmlFor="current-password" className="form-label">
                    Current password
                  </label>
                  <input
                    id="current-password"
                    type="password"
                    className="form-control"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    autoComplete="current-password"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="new-password" className="form-label">
                    New password
                  </label>
                  <input
                    id="new-password"
                    type="password"
                    className="form-control"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    minLength={6}
                    autoComplete="new-password"
                  />
                  <div className="form-text">At least 6 characters.</div>
                </div>
                <div className="mb-3">
                  <label htmlFor="confirm-password" className="form-label">
                    Confirm new password
                  </label>
                  <input
                    id="confirm-password"
                    type="password"
                    className="form-control"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    minLength={6}
                    autoComplete="new-password"
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-outline-primary"
                  disabled={changingPassword}
                >
                  {changingPassword ? "Updating…" : "Update password"}
                </button>
              </form>
            </>
          ) : (
            <dl className="row mb-0 small">
              <dt className="col-sm-3 text-muted">Name</dt>
              <dd className="col-sm-9">{user?.name}</dd>
              <dt className="col-sm-3 text-muted">Email</dt>
              <dd className="col-sm-9">{user?.email}</dd>
              <dt className="col-sm-3 text-muted">Phone</dt>
              <dd className="col-sm-9">{user?.phoneNumber || "—"}</dd>
              <dt className="col-sm-3 text-muted">Role</dt>
              <dd className="col-sm-9">
                <span className="badge bg-primary">{user?.role}</span>
              </dd>
            </dl>
          )}
        </div>
      </div>
    </>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<MarketplaceLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/cars/:id" element={<CarDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<RequireAuth />}>
          <Route path="/me" element={<ProfilePage />} />
          <Route path="/my-enquiries" element={<MyEnquiries />} />
          <Route path="/my-bids" element={<MyBids />} />
          <Route path="/my-orders" element={<MyOrders />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/compare" element={<Compare />} />
        </Route>
        <Route element={<RequireSeller />}>
          <Route path="/create-listing" element={<CreateListing />} />
          <Route path="/my-listings" element={<MyListings />} />
          <Route path="/my-listings/edit/:id" element={<EditListing />} />
          <Route path="/received-enquiries" element={<ReceivedEnquiries />} />
          <Route path="/received-bids" element={<ReceivedBids />} />
          <Route path="/seller-deliveries" element={<SellerDeliveries />} />
          <Route path="/seller-damage-reports" element={<SellerDamageReports />} />
        </Route>
      </Route>
      <Route element={<RequireAdmin />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUserManagement />} />
          <Route path="cars" element={<AdminDashboard />} />
          <Route path="enquiries" element={<AdminDashboard />} />
          <Route path="bids" element={<AdminDashboard />} />
          <Route path="payments" element={<AdminPaymentManagement />} />
          <Route path="deliveries" element={<AdminDashboard />} />
          <Route path="damage-reports" element={<AdminDashboard />} />
        </Route>
      </Route>
    </Routes>
  );
}
