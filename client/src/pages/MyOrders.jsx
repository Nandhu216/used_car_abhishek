import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../api/client";

export default function MyOrders() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    apiFetch("/payments/user", { auth: true })
      .then((data) => setPayments(data.payments || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-muted-app">Loading…</p>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h4 mb-0">My Orders</h1>
        <Link to="/" className="btn btn-outline-secondary btn-sm">Browse cars</Link>
      </div>
      {payments.length === 0 ? (
        <p className="text-muted-app">You have no orders yet.</p>
      ) : (
        <div className="card">
          <div className="list-group list-group-flush">
            {payments.map((p) => (
              <div key={p._id} className="list-group-item">
                <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
                  <div>
                    <h2 className="h6 mb-1">
                      <Link to={`/cars/${p.carId?._id}`}>{p.carId?.title}</Link>
                    </h2>
                    <p className="small text-muted-app mb-0">
                      ₹{p.totalAmount?.toLocaleString()} · {p.paymentType} ·{" "}
                      <span className="badge bg-secondary">{p.paymentStatus}</span>
                    </p>
                    {p.paymentType === "Installment" && (
                      <p className="small mb-0">
                        Down: ₹{p.downPayment?.toLocaleString()} · {p.installmentMonths} months · ₹{p.monthlyAmount?.toLocaleString()}/mo
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
