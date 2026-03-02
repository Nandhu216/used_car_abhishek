import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../api/client";

export default function AdminPaymentManagement() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [updating, setUpdating] = useState(null);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const res = await apiFetch("/admin/payments", { auth: true });
      setPayments(res.payments || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = payments.filter((p) => !statusFilter || p.paymentStatus === statusFilter);

  async function updateStatus(paymentId, paymentStatus) {
    setError("");
    setUpdating(paymentId);
    try {
      await apiFetch(`/payments/${paymentId}`, {
        method: "PUT",
        auth: true,
        body: { paymentStatus },
      });
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdating(null);
    }
  }

  return (
    <>
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
        <h1 className="h4 mb-0">Payment Management</h1>
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
              <label className="form-label small mb-0">Status</label>
              <select
                className="form-select form-select-sm"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All statuses</option>
                <option value="Pending">Pending</option>
                <option value="Ongoing">Ongoing</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <p className="text-muted-app">Loading…</p>
      ) : (
        <div className="card">
          <div className="card-header bg-transparent fw-semibold">
            Payments ({filtered.length})
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Car</th>
                    <th>Buyer</th>
                    <th>Seller</th>
                    <th>Amount</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-muted-app text-center py-4">
                        No payments match.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((p) => (
                      <tr key={p._id}>
                        <td>
                          <Link to={`/cars/${p.carId?._id}`} className="text-decoration-none">
                            {p.carId?.title || "—"}
                          </Link>
                        </td>
                        <td>{p.buyerId?.name || "—"}</td>
                        <td>{p.sellerId?.name || "—"}</td>
                        <td>₹{p.totalAmount?.toLocaleString()}</td>
                        <td>
                          <span className="badge bg-info">{p.paymentType}</span>
                          {p.paymentType === "Installment" && (
                            <span className="small text-muted-app ms-1">
                              ({p.installmentMonths} mo)
                            </span>
                          )}
                        </td>
                        <td>
                          <span
                            className={`badge ${
                              p.paymentStatus === "Completed"
                                ? "bg-success"
                                : p.paymentStatus === "Ongoing"
                                ? "bg-warning text-dark"
                                : "bg-secondary"
                            }`}
                          >
                            {p.paymentStatus}
                          </span>
                        </td>
                        <td>
                          {p.paymentStatus !== "Completed" && (
                            <div className="dropdown">
                              <button
                                className="btn btn-outline-primary btn-sm dropdown-toggle"
                                type="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                                disabled={updating === p._id}
                              >
                                {updating === p._id ? "…" : "Update status"}
                              </button>
                              <ul className="dropdown-menu dropdown-menu-end">
                                <li>
                                  <button
                                    type="button"
                                    className="dropdown-item"
                                    onClick={() => updateStatus(p._id, "Pending")}
                                  >
                                    Pending
                                  </button>
                                </li>
                                <li>
                                  <button
                                    type="button"
                                    className="dropdown-item"
                                    onClick={() => updateStatus(p._id, "Ongoing")}
                                  >
                                    Ongoing
                                  </button>
                                </li>
                                <li>
                                  <button
                                    type="button"
                                    className="dropdown-item"
                                    onClick={() => updateStatus(p._id, "Completed")}
                                  >
                                    Completed
                                  </button>
                                </li>
                              </ul>
                            </div>
                          )}
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
    </>
  );
}
