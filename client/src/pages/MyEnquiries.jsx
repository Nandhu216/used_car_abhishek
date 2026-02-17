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
    <div style={{ maxWidth: 980, margin: "30px auto", padding: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ margin: 0 }}>My enquiries</h2>
        <Link to="/">Back</Link>
      </div>

      {loading ? <p>Loading...</p> : null}
      {error ? <p style={{ color: "crimson" }}>{error}</p> : null}
      {!loading && !error && enquiries.length === 0 ? <p>No enquiries yet.</p> : null}

      <div style={{ display: "grid", gap: 12, marginTop: 12 }}>
        {enquiries.map((e) => (
          <div key={e._id} style={{ border: "1px solid #0002", borderRadius: 8, padding: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
              <div>
                <b>{e.carId?.title || "Car"}</b>
                <div style={{ opacity: 0.8, fontSize: 14 }}>
                  Status: <b>{e.status}</b>
                </div>
                <div style={{ opacity: 0.8, fontSize: 14 }}>
                  Seller: {e.sellerId?.name} • {e.sellerId?.email}
                </div>
              </div>
              <Link to={`/cars/${e.carId?._id}`}>View car</Link>
            </div>
            <div style={{ marginTop: 8, whiteSpace: "pre-wrap" }}>{e.message}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

