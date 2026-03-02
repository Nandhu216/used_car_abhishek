import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../api/client";

export default function MyEnquiries() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const data = await apiFetch("/enquiries/user", { auth: true });
        if (!ignore) setEnquiries(data.enquiries || []);
      } catch (err) {
        if (!ignore) setError(err.message);
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    load();
    return () => {
      ignore = true;
    };
  }, []);

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h4 mb-0">My enquiries</h1>
        <Link to="/" className="btn btn-outline-secondary btn-sm">
          Back
        </Link>
      </div>

      {loading && <p className="text-muted-app">Loading…</p>}
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      {!loading && !error && enquiries.length === 0 && (
        <p className="text-muted-app">No enquiries yet.</p>
      )}

      <div className="row g-3">
        {enquiries.map((e) => (
          <div key={e._id} className="col-12">
            <div className="card">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start gap-2 flex-wrap">
                  <div>
                    <h2 className="h6 card-title mb-1">{e.carId?.title || "Car"}</h2>
                    <p className="small text-muted-app mb-1">
                      Status: <span className="badge bg-secondary">{e.status}</span>
                    </p>
                    <p className="small mb-0">
                      Seller: {e.sellerId?.name} · {e.sellerId?.email}
                    </p>
                  </div>
                  <Link
                    to={`/cars/${e.carId?._id}`}
                    className="btn btn-outline-primary btn-sm"
                  >
                    View car
                  </Link>
                </div>
                <div className="mt-3 small text-break" style={{ whiteSpace: "pre-wrap" }}>
                  {e.message}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
