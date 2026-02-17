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
        const results = await Promise.all(ids.map((id) => apiFetch(`/cars/${id}`)));
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
    <div style={{ maxWidth: 1100, margin: "30px auto", padding: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ margin: 0 }}>Compare cars</h2>
        <div style={{ display: "flex", gap: 12 }}>
          <button onClick={clear} disabled={ids.length === 0}>
            Clear
          </button>
          <Link to="/">Back</Link>
        </div>
      </div>

      {loading ? <p>Loading...</p> : null}
      {error ? <p style={{ color: "crimson" }}>{error}</p> : null}
      {!loading && !error && cars.length === 0 ? <p>No cars selected for comparison.</p> : null}

      {cars.length ? (
        <div style={{ overflowX: "auto", marginTop: 12 }}>
          <table style={{ borderCollapse: "collapse", width: "100%" }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", padding: 8, borderBottom: "1px solid #0002" }}>
                  Field
                </th>
                {cars.map((c) => (
                  <th key={c._id} style={{ textAlign: "left", padding: 8, borderBottom: "1px solid #0002" }}>
                    <Link to={`/cars/${c._id}`}>{c.title}</Link>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ["Price", (c) => `₹${c.price}`],
                ["Year", (c) => c.year],
                ["Mileage", (c) => `${c.mileage} km`],
                ["Fuel", (c) => c.fuelType],
                ["Transmission", (c) => c.transmission],
                ["Location", (c) => c.location],
              ].map(([label, fn]) => (
                <tr key={label}>
                  <td style={{ padding: 8, borderBottom: "1px solid #0001", opacity: 0.8 }}>{label}</td>
                  {cars.map((c) => (
                    <td key={c._id} style={{ padding: 8, borderBottom: "1px solid #0001" }}>
                      {fn(c)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
}

