import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../api/client";

export default function SellerDeliveries() {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const data = await apiFetch("/delivery/seller", { auth: true });
      setDeliveries(data.deliveries || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function updateStatus(id, deliveryStatus) {
    setError("");
    try {
      await apiFetch(`/delivery/${id}`, {
        method: "PUT",
        auth: true,
        body: { deliveryStatus },
      });
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) return <p className="text-muted-app">Loading…</p>;

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h4 mb-0">Delivery requests</h1>
        <Link to="/" className="btn btn-outline-secondary btn-sm">Back</Link>
      </div>
      {error && <div className="alert alert-danger">{error}</div>}
      {deliveries.length === 0 ? (
        <p className="text-muted-app">No delivery requests yet.</p>
      ) : (
        <div className="card">
          <div className="list-group list-group-flush">
            {deliveries.map((d) => (
              <div key={d._id} className="list-group-item">
                <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
                  <div>
                    <h2 className="h6 mb-1">
                      <Link to={`/cars/${d.carId?._id}`}>{d.carId?.title}</Link>
                    </h2>
                    <p className="small text-muted-app mb-0">
                      Buyer: {d.buyerId?.name} · {d.deliveryType}
                      {d.deliveryAddress && ` · ${d.deliveryAddress}`}
                    </p>
                    <span className="badge bg-secondary">{d.deliveryStatus}</span>
                  </div>
                  {d.deliveryStatus !== "Delivered" && (
                    <div className="d-flex gap-1">
                      {d.deliveryStatus === "Pending" && (
                        <button
                          type="button"
                          className="btn btn-outline-primary btn-sm"
                          onClick={() => updateStatus(d._id, "Shipped")}
                        >
                          Mark shipped
                        </button>
                      )}
                      {(d.deliveryStatus === "Pending" || d.deliveryStatus === "Shipped") && (
                        <button
                          type="button"
                          className="btn btn-success btn-sm"
                          onClick={() => updateStatus(d._id, "Delivered")}
                        >
                          Mark delivered
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
