import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../api/client";

export default function MyListings() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  return (
    <div style={{ maxWidth: 980, margin: "30px auto", padding: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ margin: 0 }}>My listings</h2>
        <div style={{ display: "flex", gap: 12 }}>
          <Link to="/create-listing">Create listing</Link>
          <Link to="/">Back</Link>
        </div>
      </div>

      {loading ? <p>Loading...</p> : null}
      {error ? <p style={{ color: "crimson" }}>{error}</p> : null}
      {!loading && !error && cars.length === 0 ? <p>No listings yet.</p> : null}

      <div style={{ display: "grid", gap: 12, marginTop: 12 }}>
        {cars.map((c) => (
          <div key={c._id} style={{ border: "1px solid #0002", borderRadius: 8, padding: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
              <div>
                <b>{c.title}</b>
                <div style={{ opacity: 0.8, fontSize: 14 }}>
                  {c.brand} {c.model} • {c.year}
                </div>
              </div>
              <div>
                <b>₹{c.price}</b>
              </div>
            </div>
            <div style={{ marginTop: 8 }}>
              <Link to={`/cars/${c._id}`}>View</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

