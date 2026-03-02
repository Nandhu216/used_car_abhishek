import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const KEY = "favorites";

function loadFavs() {
  try {
    const raw = localStorage.getItem(KEY);
    const ids = JSON.parse(raw || "[]");
    return Array.isArray(ids) ? ids : [];
  } catch {
    return [];
  }
}

export default function Favorites() {
  const [ids, setIds] = useState([]);

  useEffect(() => {
    setIds(loadFavs());
  }, []);

  function clear() {
    localStorage.removeItem(KEY);
    setIds([]);
  }

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h4 mb-0">Favorites</h1>
        <div className="d-flex gap-2">
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm"
            onClick={clear}
            disabled={ids.length === 0}
          >
            Clear all
          </button>
          <Link to="/" className="btn btn-outline-secondary btn-sm">
            Back
          </Link>
        </div>
      </div>

      {ids.length === 0 ? (
        <p className="text-muted-app">No favorites yet. Add cars from the browse page.</p>
      ) : (
        <div className="row g-3">
          {ids.map((id) => (
            <div key={id} className="col-12 col-sm-6 col-md-4">
              <div className="card">
                <div className="card-body d-flex justify-content-between align-items-center">
                  <span className="small text-muted-app font-monospace">Car listing</span>
                  <Link to={`/cars/${id}`} className="btn btn-primary btn-sm">
                    Open
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
