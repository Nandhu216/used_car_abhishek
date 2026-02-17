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
      await apiFetch(`/enquiries/${id}`, { method: "PATCH", auth: true, body: { status } });
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div style={{ maxWidth: 980, margin: "30px auto", padding: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ margin: 0 }}>Received enquiries</h2>
        <Link to="/">Back</Link>
      </div>

      {loading ? <p>Loading...</p> : null}
      {error ? <p style={{ color: "crimson" }}>{error}</p> : null}
      {!loading && !error && enquiries.length === 0 ? <p>No enquiries received.</p> : null}

      <div style={{ display: "grid", gap: 12, marginTop: 12 }}>
        {enquiries.map((e) => (
          <div key={e._id} style={{ border: "1px solid #0002", borderRadius: 8, padding: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
              <div>
                <b>{e.carId?.title || "Car"}</b>
                <div style={{ opacity: 0.8, fontSize: 14 }}>
                  Buyer: {e.buyerId?.name} • {e.buyerId?.email}
                  {e.buyerId?.phoneNumber ? ` • ${e.buyerId.phoneNumber}` : ""}
                </div>
                <div style={{ opacity: 0.8, fontSize: 14 }}>
                  Status: <b>{e.status}</b>
                </div>
              </div>
              <Link to={`/cars/${e.carId?._id}`}>View car</Link>
            </div>

            <div style={{ marginTop: 8, whiteSpace: "pre-wrap" }}>{e.message}</div>

            <div style={{ marginTop: 10, display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button onClick={() => setStatus(e._id, "Responded")}>Mark Responded</button>
              <button onClick={() => setStatus(e._id, "Closed")}>Close</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

