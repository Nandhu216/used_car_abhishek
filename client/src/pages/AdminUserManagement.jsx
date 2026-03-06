import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function AdminUserManagement() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [search, setSearch] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editRole, setEditRole] = useState("buyer");
  const [editPassword, setEditPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [modalError, setModalError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const res = await apiFetch("/admin/users", { auth: true });
      setUsers(res.users || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = users.filter((u) => {
    const matchRole = !roleFilter || u.role === roleFilter;
    const q = search.trim().toLowerCase();
    const matchSearch =
      !q ||
      (u.name || "").toLowerCase().includes(q) ||
      (u.email || "").toLowerCase().includes(q) ||
      (u.phoneNumber || "").toLowerCase().includes(q);
    return matchRole && matchSearch;
  });

  function openEdit(user) {
    setEditingUser(user);
    setEditName(user.name || "");
    setEditEmail(user.email || "");
    setEditPhone(user.phoneNumber || "");
    setEditRole(user.role || "buyer");
    setEditPassword("");
    setModalError("");
  }

  function closeEdit() {
    setEditingUser(null);
    setEditName("");
    setEditEmail("");
    setEditPhone("");
    setEditRole("buyer");
    setEditPassword("");
    setModalError("");
  }

  async function handleSaveEdit(e) {
    e.preventDefault();
    setModalError("");
    setSaving(true);
    try {
      const body = {
        name: editName.trim(),
        email: editEmail.trim(),
        phoneNumber: editPhone.trim(),
        role: editRole,
      };
      if (editPassword.trim()) body.newPassword = editPassword;
      const res = await apiFetch(`/admin/users/${editingUser._id}`, {
        method: "PUT",
        auth: true,
        body,
      });
      setUsers((prev) =>
        prev.map((u) => (u._id === res.user._id ? res.user : u))
      );
      closeEdit();
    } catch (err) {
      setModalError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(u) {
    const isSelf = currentUser && (String(currentUser.id) === String(u._id) || String(currentUser._id) === String(u._id));
    if (isSelf) {
      setError("You cannot delete your own account.");
      return;
    }
    if (!window.confirm(`Delete user "${u.name}" (${u.email})? This cannot be undone.`)) return;
    setError("");
    setDeletingId(u._id);
    try {
      await apiFetch(`/admin/users/${u._id}`, { method: "DELETE", auth: true });
      setUsers((prev) => prev.filter((us) => us._id !== u._id));
    } catch (err) {
      setError(err.message);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <>
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
        <h1 className="h4 mb-0">User Management</h1>
        <Link to="/admin" className="btn btn-outline-secondary btn-sm">
          ← Dashboard
        </Link>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className="card mb-3">
        <div className="card-body py-3">
          <div className="row g-2 align-items-end">
            <div className="col-12 col-md-4">
              <label className="form-label small mb-0">Search</label>
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Name, email, phone…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="col-12 col-md-3">
              <label className="form-label small mb-0">Role</label>
              <select
                className="form-select form-select-sm"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="">All roles</option>
                <option value="buyer">Buyer</option>
                <option value="seller">Seller</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <p className="text-muted-app">Loading…</p>
      ) : (
        <div className="card">
          <div className="card-header bg-transparent fw-semibold d-flex justify-content-between align-items-center">
            <span>Users ({filtered.length})</span>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Role</th>
                    <th>Joined</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-muted-app text-center py-4">
                        No users match.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((u) => (
                      <tr key={u._id}>
                        <td>{u.name}</td>
                        <td>{u.email}</td>
                        <td>{u.phoneNumber || "—"}</td>
                        <td>
                          <span
                            className={`badge ${
                              u.role === "admin"
                                ? "bg-danger"
                                : u.role === "seller"
                                ? "bg-primary"
                                : "bg-secondary"
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td className="small text-muted-app">
                          {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "—"}
                        </td>
                        <td className="text-end">
                          <div className="d-flex gap-1 justify-content-end">
                            <button
                              type="button"
                              className="btn btn-outline-primary btn-sm"
                              onClick={() => openEdit(u)}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              className="btn btn-outline-danger btn-sm"
                              disabled={
                                deletingId === u._id ||
                                (currentUser && (String(currentUser.id) === String(u._id) || String(currentUser._id) === String(u._id)))
                              }
                              onClick={() => handleDelete(u)}
                              title={
                                currentUser && (String(currentUser.id) === String(u._id) || String(currentUser._id) === String(u._id))
                                  ? "Cannot delete your own account"
                                  : "Delete user"
                              }
                            >
                              {deletingId === u._id ? "…" : "Delete"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <div
          className="modal show d-block"
          tabIndex={-1}
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={(e) => e.target === e.currentTarget && closeEdit()}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h5 className="modal-title">Edit user</h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={closeEdit}
                />
              </div>
              <form onSubmit={handleSaveEdit}>
                <div className="modal-body">
                  {modalError && (
                    <div className="alert alert-danger py-2 small mb-3">
                      {modalError}
                    </div>
                  )}
                  <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Phone number</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      placeholder="Optional"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Role</label>
                    <select
                      className="form-select"
                      value={editRole}
                      onChange={(e) => setEditRole(e.target.value)}
                    >
                      <option value="buyer">Buyer</option>
                      <option value="seller">Seller</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">New password</label>
                    <input
                      type="password"
                      className="form-control"
                      value={editPassword}
                      onChange={(e) => setEditPassword(e.target.value)}
                      placeholder="Leave blank to keep current password"
                      minLength={6}
                      autoComplete="new-password"
                    />
                    <div className="form-text">Leave blank to keep current password. Min 6 characters if set.</div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={closeEdit}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={saving}
                  >
                    {saving ? "Saving…" : "Save changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
