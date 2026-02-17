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
    <div style={{ maxWidth: 980, margin: "30px auto", padding: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ margin: 0 }}>Favorites</h2>
        <div style={{ display: "flex", gap: 12 }}>
          <button onClick={clear} disabled={ids.length === 0}>
            Clear
          </button>
          <Link to="/">Back</Link>
        </div>
      </div>

      {ids.length === 0 ? (
        <p style={{ marginTop: 12 }}>No favorites yet. Add some from Home.</p>
      ) : (
        <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
          {ids.map((id) => (
            <div key={id} style={{ border: "1px solid #0002", borderRadius: 8, padding: 12 }}>
              <b>Car ID:</b> {id} — <Link to={`/cars/${id}`}>Open</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

