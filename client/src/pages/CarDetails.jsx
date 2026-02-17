import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { apiFetch } from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function CarDetails() {
  const { id } = useParams();
  const { isAuthed } = useAuth();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sentOk, setSentOk] = useState(false);

  useEffect(() => {
    let ignore = false;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const data = await apiFetch(`/cars/${id}`);
        if (!ignore) setCar(data.car);
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
  }, [id]);

  return (
    <div style={{ maxWidth: 980, margin: "30px auto", padding: 16 }}>
      <Link to="/">← Back</Link>
      {loading ? <p>Loading...</p> : null}
      {error ? <p style={{ color: "crimson" }}>{error}</p> : null}
      {!loading && !error && !car ? <p>Not found.</p> : null}

      {car ? (
        <div style={{ marginTop: 14 }}>
          <h2 style={{ margin: "0 0 6px" }}>{car.title}</h2>
          <div style={{ opacity: 0.8 }}>
            {car.brand} {car.model} • {car.year} • {car.fuelType} • {car.transmission}
          </div>
          <p>
            <b>₹{car.price}</b> • {car.mileage} km • {car.location}
          </p>
          <p style={{ opacity: 0.85 }}>
            Seller: <b>{car.sellerId?.name}</b> • {car.sellerId?.email}
            {car.sellerId?.phoneNumber ? ` • ${car.sellerId.phoneNumber}` : ""}
          </p>

          {car.images?.length ? (
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {car.images.map((src) => (
                <img
                  key={src}
                  src={src}
                  alt="car"
                  style={{ width: 220, height: 140, objectFit: "cover", borderRadius: 8 }}
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              ))}
            </div>
          ) : null}

          <div style={{ marginTop: 16, padding: 12, border: "1px solid #0002", borderRadius: 8 }}>
            <h3 style={{ marginTop: 0 }}>Contact seller</h3>
            {!isAuthed ? (
              <p style={{ opacity: 0.8 }}>
                Please <Link to="/login">login</Link> to send an enquiry.
              </p>
            ) : (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  setSentOk(false);
                  setError("");
                  setSending(true);
                  try {
                    await apiFetch("/enquiries", {
                      method: "POST",
                      auth: true,
                      body: { carId: car._id, message },
                    });
                    setMessage("");
                    setSentOk(true);
                  } catch (err) {
                    setError(err.message);
                  } finally {
                    setSending(false);
                  }
                }}
                style={{ display: "grid", gap: 10 }}
              >
                {sentOk ? <p style={{ color: "green" }}>Enquiry sent.</p> : null}
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  required
                  placeholder="Write your message to the seller..."
                  style={{ width: "100%", padding: 10 }}
                />
                <button disabled={sending} type="submit" style={{ padding: 10 }}>
                  {sending ? "Sending..." : "Send enquiry"}
                </button>
              </form>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

