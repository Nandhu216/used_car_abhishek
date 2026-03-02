import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../api/client";

export default function MyBids() {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    apiFetch("/bids/my", { auth: true })
      .then((data) => setBids(data.bids || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-muted-app">Loading…</p>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h4 mb-0">My Bids</h1>
        <Link to="/" className="btn btn-outline-secondary btn-sm">Browse cars</Link>
      </div>
      {bids.length === 0 ? (
        <p className="text-muted-app">You have not placed any bids. Browse auction listings to place a bid.</p>
      ) : (
        <div className="row g-3">
          {bids.map((b) => (
            <div key={b._id} className="col-12 col-md-6 col-lg-4">
              <div className="card h-100">
                <div className="card-body">
                  <h2 className="h6 card-title">
                    <Link to={`/cars/${b.carId?._id}`}>{b.carId?.title || "Car"}</Link>
                  </h2>
                  <p className="small text-muted-app mb-1">
                    ₹{b.bidAmount?.toLocaleString()} · <span className="badge bg-secondary">{b.status}</span>
                  </p>
                  <p className="small mb-0">
                    {b.carId?.brand} {b.carId?.model} · {b.carId?.year}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
