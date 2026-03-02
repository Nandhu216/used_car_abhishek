import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { apiFetch } from "../api/client";

export default function AdminDashboard() {
  const location = useLocation();
  const segment = location.pathname.split("/")[2];
  const activeList = ["users", "cars", "enquiries", "bids", "payments", "deliveries", "damage-reports"];
  const active = activeList.includes(segment) ? segment : "overview";

  const [users, setUsers] = useState([]);
  const [cars, setCars] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [bids, setBids] = useState([]);
  const [payments, setPayments] = useState([]);
  const [deliveries, setDeliveries] = useState([]);
  const [damageReports, setDamageReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadUsers() {
    const res = await apiFetch("/admin/users", { auth: true });
    setUsers(res.users || []);
  }

  async function loadCars() {
    const res = await apiFetch("/admin/cars", { auth: true });
    setCars(res.cars || []);
  }

  async function loadEnquiries() {
    const res = await apiFetch("/admin/enquiries", { auth: true });
    setEnquiries(res.enquiries || []);
  }
  async function loadBids() {
    const res = await apiFetch("/admin/bids", { auth: true });
    setBids(res.bids || []);
  }
  async function loadPayments() {
    const res = await apiFetch("/admin/payments", { auth: true });
    setPayments(res.payments || []);
  }
  async function loadDeliveries() {
    const res = await apiFetch("/admin/deliveries", { auth: true });
    setDeliveries(res.deliveries || []);
  }
  async function loadDamageReports() {
    const res = await apiFetch("/admin/damage-reports", { auth: true });
    setDamageReports(res.damageReports || []);
  }

  async function load() {
    setLoading(true);
    setError("");
    try {
      if (active === "users") await loadUsers();
      else if (active === "cars") await loadCars();
      else if (active === "enquiries") await loadEnquiries();
      else if (active === "bids") await loadBids();
      else if (active === "payments") await loadPayments();
      else if (active === "deliveries") await loadDeliveries();
      else if (active === "damage-reports") await loadDamageReports();
      else {
        await Promise.all([
          loadUsers(),
          loadCars(),
          loadEnquiries(),
          loadBids(),
          loadPayments(),
          loadDeliveries(),
          loadDamageReports(),
        ]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [active]);

  async function toggleAvailability(car) {
    setError("");
    try {
      await apiFetch(`/admin/cars/${car._id}/availability`, {
        method: "PATCH",
        auth: true,
        body: { isAvailable: !car.isAvailable },
      });
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function removeCar(carId) {
    setError("");
    try {
      await apiFetch(`/admin/cars/${carId}`, { method: "DELETE", auth: true });
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <>
      <h1 className="h4 mb-4">Admin Dashboard</h1>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {loading && <p className="text-muted-app">Loading…</p>}

      {active === "overview" && !loading && (
        <div className="row g-3 mb-4">
          <div className="col-6 col-md-4 col-lg-2">
            <div className="card border-0 shadow-sm">
              <div className="card-body py-3">
                <h2 className="h6 text-muted-app mb-0">Users</h2>
                <p className="h4 mb-0">{users.length}</p>
                <Link to="/admin/users" className="small text-primary">View</Link>
              </div>
            </div>
          </div>
          <div className="col-6 col-md-4 col-lg-2">
            <div className="card border-0 shadow-sm">
              <div className="card-body py-3">
                <h2 className="h6 text-muted-app mb-0">Listings</h2>
                <p className="h4 mb-0">{cars.length}</p>
                <Link to="/admin/cars" className="small text-primary">Manage</Link>
              </div>
            </div>
          </div>
          <div className="col-6 col-md-4 col-lg-2">
            <div className="card border-0 shadow-sm">
              <div className="card-body py-3">
                <h2 className="h6 text-muted-app mb-0">Enquiries</h2>
                <p className="h4 mb-0">{enquiries.length}</p>
                <Link to="/admin/enquiries" className="small text-primary">View</Link>
              </div>
            </div>
          </div>
          <div className="col-6 col-md-4 col-lg-2">
            <div className="card border-0 shadow-sm">
              <div className="card-body py-3">
                <h2 className="h6 text-muted-app mb-0">Bids</h2>
                <p className="h4 mb-0">{bids.length}</p>
                <Link to="/admin/bids" className="small text-primary">View</Link>
              </div>
            </div>
          </div>
          <div className="col-6 col-md-4 col-lg-2">
            <div className="card border-0 shadow-sm">
              <div className="card-body py-3">
                <h2 className="h6 text-muted-app mb-0">Payments</h2>
                <p className="h4 mb-0">{payments.length}</p>
                <Link to="/admin/payments" className="small text-primary">View</Link>
              </div>
            </div>
          </div>
          <div className="col-6 col-md-4 col-lg-2">
            <div className="card border-0 shadow-sm">
              <div className="card-body py-3">
                <h2 className="h6 text-muted-app mb-0">Deliveries</h2>
                <p className="h4 mb-0">{deliveries.length}</p>
                <Link to="/admin/deliveries" className="small text-primary">View</Link>
              </div>
            </div>
          </div>
          <div className="col-6 col-md-4 col-lg-2">
            <div className="card border-0 shadow-sm">
              <div className="card-body py-3">
                <h2 className="h6 text-muted-app mb-0">Damage</h2>
                <p className="h4 mb-0">{damageReports.length}</p>
                <Link to="/admin/damage-reports" className="small text-primary">View</Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {active === "overview" && !loading && (
        <p className="text-muted-app small">Use the sidebar to manage users, listings, enquiries, bids, payments, deliveries, and damage reports.</p>
      )}

      {active === "users" && !loading && (
        <div className="card">
          <div className="card-header bg-transparent fw-semibold">Users</div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id}>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td><span className="badge bg-secondary">{u.role}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {active === "cars" && !loading && (
        <div className="card">
          <div className="card-header bg-transparent fw-semibold">Listings</div>
          <div className="list-group list-group-flush">
            {cars.length === 0 ? (
              <div className="list-group-item text-muted-app">No listings.</div>
            ) : (
              cars.map((c) => (
                <div key={c._id} className="list-group-item">
                  <div className="d-flex justify-content-between align-items-start gap-3 flex-wrap">
                    <div>
                      <h2 className="h6 mb-1">{c.title}</h2>
                      <p className="small text-muted-app mb-1">
                        Seller: {c.sellerId?.name} · {c.sellerId?.email}
                      </p>
                      <span className={`badge ${c.isAvailable ? "bg-success" : "bg-warning text-dark"}`}>
                        {c.isAvailable ? "Available" : "Unavailable"}
                      </span>
                    </div>
                    <div className="d-flex gap-2 flex-wrap">
                      <Link to={`/cars/${c._id}`} className="btn btn-outline-primary btn-sm">
                        View
                      </Link>
                      <button
                        type="button"
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => toggleAvailability(c)}
                      >
                        {c.isAvailable ? "Mark unavailable" : "Mark available"}
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => removeCar(c._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {active === "enquiries" && !loading && (
        <div className="card">
          <div className="card-header bg-transparent fw-semibold">Enquiries</div>
          <div className="list-group list-group-flush">
            {enquiries.length === 0 ? (
              <div className="list-group-item text-muted-app">No enquiries.</div>
            ) : (
              enquiries.map((e) => (
                <div key={e._id} className="list-group-item">
                  <h2 className="h6 mb-1">{e.carId?.title}</h2>
                  <p className="small text-muted-app mb-1">
                    Buyer: {e.buyerId?.name} · Seller: {e.sellerId?.name} · Status:{" "}
                    <span className="badge bg-secondary">{e.status}</span>
                  </p>
                  <div className="small text-break" style={{ whiteSpace: "pre-wrap" }}>
                    {e.message}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {active === "bids" && !loading && (
        <div className="card">
          <div className="card-header bg-transparent fw-semibold">Bids</div>
          <div className="list-group list-group-flush">
            {bids.length === 0 ? (
              <div className="list-group-item text-muted-app">No bids.</div>
            ) : (
              bids.map((b) => (
                <div key={b._id} className="list-group-item">
                  <h2 className="h6 mb-1">{b.carId?.title}</h2>
                  <p className="small text-muted-app mb-0">
                    Buyer: {b.buyerId?.name} · ₹{b.bidAmount?.toLocaleString()} ·{" "}
                    <span className="badge bg-secondary">{b.status}</span>
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {active === "payments" && !loading && (
        <div className="card">
          <div className="card-header bg-transparent fw-semibold">Payments</div>
          <div className="list-group list-group-flush">
            {payments.length === 0 ? (
              <div className="list-group-item text-muted-app">No payments.</div>
            ) : (
              payments.map((p) => (
                <div key={p._id} className="list-group-item">
                  <h2 className="h6 mb-1">{p.carId?.title}</h2>
                  <p className="small text-muted-app mb-0">
                    Buyer: {p.buyerId?.name} · ₹{p.totalAmount?.toLocaleString()} · {p.paymentType} ·{" "}
                    <span className="badge bg-secondary">{p.paymentStatus}</span>
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {active === "deliveries" && !loading && (
        <div className="card">
          <div className="card-header bg-transparent fw-semibold">Deliveries</div>
          <div className="list-group list-group-flush">
            {deliveries.length === 0 ? (
              <div className="list-group-item text-muted-app">No deliveries.</div>
            ) : (
              deliveries.map((d) => (
                <div key={d._id} className="list-group-item">
                  <h2 className="h6 mb-1">{d.carId?.title}</h2>
                  <p className="small text-muted-app mb-0">
                    Buyer: {d.buyerId?.name} · {d.deliveryType} ·{" "}
                    <span className="badge bg-secondary">{d.deliveryStatus}</span>
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {active === "damage-reports" && !loading && (
        <div className="card">
          <div className="card-header bg-transparent fw-semibold">Damage Reports</div>
          <div className="list-group list-group-flush">
            {damageReports.length === 0 ? (
              <div className="list-group-item text-muted-app">No damage reports.</div>
            ) : (
              damageReports.map((r) => (
                <div key={r._id} className="list-group-item">
                  <h2 className="h6 mb-1">{r.carId?.title}</h2>
                  <p className="small text-muted-app mb-1">
                    Buyer: {r.buyerId?.name} · Reduction: ₹{r.requestedReductionAmount?.toLocaleString()} ·{" "}
                    <span className="badge bg-secondary">{r.status}</span>
                  </p>
                  <div className="small text-break">{r.description}</div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </>
  );
}
