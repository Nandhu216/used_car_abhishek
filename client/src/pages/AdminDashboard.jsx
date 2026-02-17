import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../api/client";

function Tabs({ active, setActive }) {
  const tabs = ["users", "cars", "enquiries"];
  return (
    <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 12 }}>
      {tabs.map((t) => (
        <button
          key={t}
          onClick={() => setActive(t)}
          style={{ fontWeight: active === t ? "bold" : "normal" }}
        >
          {t}
        </button>
      ))}
    </div>
  );
}

export default function AdminDashboard() {
  const [active, setActive] = useState("cars");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      if (active === "users") {
        const res = await apiFetch("/admin/users", { auth: true });
        setData(res.users || []);
      } else if (active === "cars") {
        const res = await apiFetch("/admin/cars", { auth: true });
        setData(res.cars || []);
      } else {
        const res = await apiFetch("/admin/enquiries", { auth: true });
        setData(res.enquiries || []);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [active]);

  async function toggleAvailability(car) {
    setError("");
    try {
      await apiFetch(`/admin/cars/${car._id}/availability`, {
        method: "PATCH",
        auth: true,
        body: { isAvailable: !car.isAvailable },
      });
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function removeCar(carId) {
    setError("");
    try {
      await apiFetch(`/admin/cars/${carId}`, { method: "DELETE", auth: true });
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div style={{ maxWidth: 1100, margin: "30px auto", padding: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ margin: 0 }}>Admin Dashboard</h2>
        <Link to="/">Back</Link>
      </div>

      <Tabs active={active} setActive={setActive} />

      {loading ? <p>Loading...</p> : null}
      {error ? <p style={{ color: "crimson" }}>{error}</p> : null}

      {!loading && !error ? (
        <div style={{ marginTop: 12 }}>
          {active === "users" ? (
            <div style={{ display: "grid", gap: 10 }}>
              {data.map((u) => (
                <div key={u._id} style={{ border: "1px solid #0002", borderRadius: 8, padding: 12 }}>
                  <b>{u.name}</b> — {u.email} — <b>{u.role}</b>
                </div>
              ))}
            </div>
          ) : null}

          {active === "cars" ? (
            <div style={{ display: "grid", gap: 10 }}>
              {data.map((c) => (
                <div key={c._id} style={{ border: "1px solid #0002", borderRadius: 8, padding: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                    <div>
                      <b>{c.title}</b>
                      <div style={{ opacity: 0.8, fontSize: 14 }}>
                        Seller: {c.sellerId?.name} • {c.sellerId?.email}
                      </div>
                      <div style={{ opacity: 0.8, fontSize: 14 }}>
                        Available: <b>{String(c.isAvailable)}</b>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                      <Link to={`/cars/${c._id}`}>View</Link>
                      <button onClick={() => toggleAvailability(c)}>
                        {c.isAvailable ? "Mark unavailable" : "Mark available"}
                      </button>
                      <button onClick={() => removeCar(c._id)} style={{ color: "crimson" }}>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : null}

          {active === "enquiries" ? (
            <div style={{ display: "grid", gap: 10 }}>
              {data.map((e) => (
                <div key={e._id} style={{ border: "1px solid #0002", borderRadius: 8, padding: 12 }}>
                  <b>{e.carId?.title}</b>
                  <div style={{ opacity: 0.8, fontSize: 14 }}>
                    Buyer: {e.buyerId?.name} • Seller: {e.sellerId?.name} • Status: <b>{e.status}</b>
                  </div>
                  <div style={{ marginTop: 6, whiteSpace: "pre-wrap" }}>{e.message}</div>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

