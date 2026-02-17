import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiFetch } from "../api/client";

export default function CreateListing() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [rec, setRec] = useState(null);

  const [title, setTitle] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("2020");
  const [price, setPrice] = useState("500000");
  const [mileage, setMileage] = useState("30000");
  const [fuelType, setFuelType] = useState("Petrol");
  const [transmission, setTransmission] = useState("Manual");
  const [location, setLocation] = useState("");
  const [imagesText, setImagesText] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const images = imagesText
        .split("\n")
        .map((x) => x.trim())
        .filter(Boolean);

      const data = await apiFetch("/cars", {
        method: "POST",
        auth: true,
        body: {
          title,
          brand,
          model,
          year: Number(year),
          price: Number(price),
          mileage: Number(mileage),
          fuelType,
          transmission,
          location,
          images,
        },
      });
      navigate(`/cars/${data.car._id}`, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function getRecommendation() {
    setError("");
    try {
      const data = await apiFetch("/price/recommendation", {
        method: "POST",
        body: { brand, model, year: Number(year), mileage: Number(mileage) },
      });
      setRec(data);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div style={{ maxWidth: 720, margin: "30px auto", padding: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ margin: 0 }}>Create listing</h2>
        <Link to="/">Back</Link>
      </div>
      {error ? <p style={{ color: "crimson" }}>{error}</p> : null}

      <form onSubmit={onSubmit} style={{ display: "grid", gap: 10, marginTop: 12 }}>
        <label>
          Title
          <input value={title} onChange={(e) => setTitle(e.target.value)} required style={{ width: "100%", padding: 8 }} />
        </label>

        <div style={{ display: "grid", gap: 10, gridTemplateColumns: "1fr 1fr" }}>
          <label>
            Brand
            <input value={brand} onChange={(e) => setBrand(e.target.value)} required style={{ width: "100%", padding: 8 }} />
          </label>
          <label>
            Model
            <input value={model} onChange={(e) => setModel(e.target.value)} required style={{ width: "100%", padding: 8 }} />
          </label>
        </div>

        <div style={{ display: "grid", gap: 10, gridTemplateColumns: "1fr 1fr 1fr" }}>
          <label>
            Year
            <input value={year} onChange={(e) => setYear(e.target.value)} required type="number" style={{ width: "100%", padding: 8 }} />
          </label>
          <label>
            Price (₹)
            <input value={price} onChange={(e) => setPrice(e.target.value)} required type="number" style={{ width: "100%", padding: 8 }} />
          </label>
          <label>
            Mileage (km)
            <input value={mileage} onChange={(e) => setMileage(e.target.value)} required type="number" style={{ width: "100%", padding: 8 }} />
          </label>
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <button type="button" onClick={getRecommendation}>
            Get price recommendation
          </button>
          {rec?.recommendedPrice ? (
            <span style={{ opacity: 0.85 }}>
              Recommended: <b>₹{rec.recommendedPrice}</b>
            </span>
          ) : null}
        </div>

        <div style={{ display: "grid", gap: 10, gridTemplateColumns: "1fr 1fr" }}>
          <label>
            Fuel type
            <select value={fuelType} onChange={(e) => setFuelType(e.target.value)} style={{ width: "100%", padding: 8 }}>
              <option value="Petrol">Petrol</option>
              <option value="Diesel">Diesel</option>
              <option value="Electric">Electric</option>
            </select>
          </label>
          <label>
            Transmission
            <select value={transmission} onChange={(e) => setTransmission(e.target.value)} style={{ width: "100%", padding: 8 }}>
              <option value="Manual">Manual</option>
              <option value="Automatic">Automatic</option>
            </select>
          </label>
        </div>

        <label>
          Location
          <input value={location} onChange={(e) => setLocation(e.target.value)} required style={{ width: "100%", padding: 8 }} />
        </label>

        <label>
          Images (URLs, one per line)
          <textarea value={imagesText} onChange={(e) => setImagesText(e.target.value)} rows={4} style={{ width: "100%", padding: 8 }} />
        </label>

        <button type="submit" disabled={loading} style={{ padding: 10 }}>
          {loading ? "Creating..." : "Create"}
        </button>
      </form>
    </div>
  );
}

