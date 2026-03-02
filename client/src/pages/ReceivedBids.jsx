import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../api/client";

export default function ReceivedBids() {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const data = await apiFetch("/bids/seller", { auth: true });
      setBids(data.bids || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function respond(id, status) {
    setError("");
    try {
      await apiFetch(`/bids/${id}/respond`, {
        method: "PATCH",
        auth: true,
        body: { status },
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
        <h1 className="h4 mb-0">Received bids</h1>
        <Link to="/" className="btn btn-outline-secondary btn-sm">Back</Link>
      </div>
      {error && <div className="alert alert-danger">{error}</div>}
      {bids.length === 0 ? (
        <p className="text-muted-app">No bids on your listings yet.</p>
      ) : (
        <div className="card">
          <div className="list-group list-group-flush">
            {bids.map((b) => (
              <div key={b._id} className="list-group-item">
                <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
                  <div>
                    <h2 className="h6 mb-1">
                      <Link to={`/cars/${b.carId?._id}`}>{b.carId?.title}</Link>
                    </h2>
                    <p className="small text-muted-app mb-0">
                      Buyer: {b.buyerId?.name} · ₹{b.bidAmount?.toLocaleString()} ·{" "}
                      <span className="badge bg-secondary">{b.status}</span>
                    </p>
                  </div>
                  {b.status === "Pending" && (
                    <div className="d-flex gap-1">
                      <button
                        type="button"
                        className="btn btn-success btn-sm"
                        onClick={() => respond(b._id, "Accepted")}
                      >
                        Accept
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => respond(b._id, "Rejected")}
                      >
                        Reject
                      </button>
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
