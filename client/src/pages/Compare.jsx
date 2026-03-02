import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../api/client";

const KEY = "compare";

function loadCompare() {
  try {
    const raw = localStorage.getItem(KEY);
    const ids = JSON.parse(raw || "[]");
    return Array.isArray(ids) ? ids : [];
  } catch {
    return [];
  }
}

export default function Compare() {
  const [ids, setIds] = useState([]);
  const [cars, setCars] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setIds(loadCompare());
  }, []);

  useEffect(() => {
    let ignore = false;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const results = await Promise.all(
          ids.map((id) => apiFetch(`/cars/${id}`))
        );
        if (!ignore) setCars(results.map((r) => r.car));
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
  }, [ids]);

  function clear() {
    localStorage.removeItem(KEY);
    setIds([]);
    setCars([]);
  }

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h4 mb-0">Compare cars</h1>
        <div className="d-flex gap-2">
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm"
            onClick={clear}
            disabled={ids.length === 0}
          >
            Clear
          </button>
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
        <p className="text-muted-app">No cars selected. Add cars from the browse page to compare.</p>
      )}

      {cars.length > 0 && (
        <div className="card overflow-hidden">
          <div className="table-responsive">
            <table className="table table-bordered mb-0">
              <thead className="table-light">
                <tr>
                  <th className="text-nowrap">Field</th>
                  {cars.map((c) => (
                    <th key={c._id} className="text-nowrap">
                      <Link to={`/cars/${c._id}`} className="text-decoration-none">
                        {c.title}
                      </Link>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ["Price", (c) => `₹${c.price?.toLocaleString()}`],
                  ["Year", (c) => c.year],
                  ["Mileage", (c) => `${c.mileage} km`],
                  ["Fuel", (c) => c.fuelType],
                  ["Transmission", (c) => c.transmission],
                  ["Location", (c) => c.location],
                ].map(([label, fn]) => (
                  <tr key={label}>
                    <td className="text-muted-app text-nowrap">{label}</td>
                    {cars.map((c) => (
                      <td key={c._id}>{fn(c)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}
