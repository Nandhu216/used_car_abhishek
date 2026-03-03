import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../api/client";

export default function MyListings() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [marking, setMarking] = useState(null);

  useEffect(() => {
    let ignore = false;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const data = await apiFetch("/cars/my", { auth: true });
        if (!ignore) setCars(data.cars || []);
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

  async function markAsSold(carId) {
    setError("");
    setMarking(carId);
    try {
      await apiFetch(`/cars/${carId}/sold`, { method: "PATCH", auth: true });
      setCars((prev) => prev.map((c) => (c._id === carId ? { ...c, isAvailable: false } : c)));
    } catch (err) {
      setError(err.message);
    } finally {
      setMarking(null);
    }
  }

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h4 mb-0">My listings</h1>
        <div className="d-flex gap-2">
          <Link to="/create-listing" className="btn btn-primary btn-sm">
            New listing
          </Link>
          <Link to="/" className="btn btn-outline-secondary btn-sm">
            Back
          </Link>
        </div>
      </div>

      {loading && <p className="text-muted-app">Loading…</p>}
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      {!loading && !error && cars.length === 0 && (
        <p className="text-muted-app">No listings yet. Create one to get started.</p>
      )}

      <div className="row g-3">
        {cars.map((c) => (
          <div key={c._id} className="col-12 col-md-6 col-lg-4">
            <div className="card h-100">
              <div className="card-body d-flex flex-column">
                <h2 className="h6 card-title mb-2">{c.title}</h2>
                <p className="small text-muted-app mb-2">
                  {c.brand} {c.model} · {c.year}
                </p>
                <p className="mb-3">
                  <strong>₹{c.price?.toLocaleString()}</strong>
                  {c.isAvailable ? (
                    <span className="badge bg-success ms-2">Available</span>
                  ) : (
                    <span className="badge bg-secondary ms-2">Sold</span>
                  )}
                </p>
                <div className="mt-auto">
                  <div className="dropdown">
                    <button
                      className="btn btn-outline-secondary btn-sm dropdown-toggle"
                      type="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      Actions
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end">
                      <li>
                        <Link to={`/cars/${c._id}`} className="dropdown-item">
                          View
                        </Link>
                      </li>
                      <li>
                        <Link to={`/my-listings/edit/${c._id}`} className="dropdown-item">
                          Edit
                        </Link>
                      </li>
                      {c.isAvailable && (
                        <li>
                          <hr className="dropdown-divider" />
                          <button
                            type="button"
                            className="dropdown-item text-warning"
                            disabled={marking === c._id}
                            onClick={() => markAsSold(c._id)}
                          >
                            {marking === c._id ? "…" : "Mark sold"}
                          </button>
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
