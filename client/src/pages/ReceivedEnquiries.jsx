import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../api/client";

export default function ReceivedEnquiries() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const data = await apiFetch("/enquiries/received", { auth: true });
      setEnquiries(data.enquiries || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function setStatus(id, status) {
    setError("");
    try {
      await apiFetch(`/enquiries/${id}`, {
        method: "PATCH",
        auth: true,
        body: { status },
      });
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h4 mb-0">Received enquiries</h1>
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
        <p className="text-muted-app">No enquiries received yet.</p>
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
                      Buyer: {e.buyerId?.name} · {e.buyerId?.email}
                      {e.buyerId?.phoneNumber ? ` · ${e.buyerId.phoneNumber}` : ""}
                    </p>
                    <p className="small mb-0">
                      Status: <span className="badge bg-secondary">{e.status}</span>
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
                <div className="mt-3 d-flex gap-2 flex-wrap">
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => setStatus(e._id, "Responded")}
                  >
                    Mark responded
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => setStatus(e._id, "Closed")}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
