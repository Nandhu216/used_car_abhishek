import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../api/client";
import { useAuth } from "../context/AuthContext";

const FAVORITES_KEY = "favorites";
const COMPARE_KEY = "compare";

function loadIds(key) {
  try {
    const raw = localStorage.getItem(key);
    const ids = JSON.parse(raw || "[]");
    return Array.isArray(ids) ? ids : [];
  } catch {
    return [];
  }
}

function saveIds(key, ids) {
  localStorage.setItem(key, JSON.stringify(ids));
}

function CarCard({ car }) {
  const [fav, setFav] = useState(false);
  const [cmp, setCmp] = useState(false);

  useEffect(() => {
    const favs = loadIds(FAVORITES_KEY);
    setFav(favs.includes(car._id));
    const cmps = loadIds(COMPARE_KEY);
    setCmp(cmps.includes(car._id));
  }, [car._id]);

  function toggle(key, current, setter, max) {
    const ids = loadIds(key);
    if (current) {
      const next = ids.filter((x) => x !== car._id);
      saveIds(key, next);
      setter(false);
      return;
    }
    const next = ids.includes(car._id) ? ids : [...ids, car._id];
    if (max && next.length > max) return;
    saveIds(key, next);
    setter(true);
  }

  return (
    <div style={{ border: "1px solid #0002", borderRadius: 8, padding: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
        <div>
          <h3 style={{ margin: "0 0 6px" }}>{car.title}</h3>
          <div style={{ opacity: 0.8, fontSize: 14 }}>
            {car.brand} {car.model} • {car.year} • {car.fuelType} • {car.transmission}
          </div>
          <div style={{ marginTop: 6 }}>
            <b>₹{car.price}</b> • {car.mileage} km • {car.location}
          </div>
        </div>
        {car.images?.[0] ? (
          <img
            src={car.images[0]}
            alt={car.title}
            style={{ width: 140, height: 90, objectFit: "cover", borderRadius: 6 }}
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        ) : null}
      </div>
      <div style={{ marginTop: 10, display: "flex", gap: 12, flexWrap: "wrap" }}>
        <Link to={`/cars/${car._id}`}>View details</Link>
        <button onClick={() => toggle(FAVORITES_KEY, fav, setFav)}>{fav ? "Unfavorite" : "Favorite"}</button>
        <button onClick={() => toggle(COMPARE_KEY, cmp, setCmp, 4)}>{cmp ? "Remove compare" : "Compare"}</button>
        <span style={{ opacity: 0.7, fontSize: 13 }}>
          Seller: {car.sellerId?.name || "Unknown"}
        </span>
      </div>
    </div>
  );
}

export default function Home() {
  const { isAuthed, isAdmin, user, logout } = useAuth();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [q, setQ] = useState("");
  const [brand, setBrand] = useState("");
  const [fuelType, setFuelType] = useState("");

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (brand) params.set("brand", brand);
    if (fuelType) params.set("fuelType", fuelType);
    return params.toString();
  }, [q, brand, fuelType]);

  useEffect(() => {
    let ignore = false;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const data = await apiFetch(`/cars${queryString ? `?${queryString}` : ""}`);
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
  }, [queryString]);

  return (
    <div style={{ maxWidth: 980, margin: "30px auto", padding: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <div>
          <h1 style={{ margin: 0 }}>Used Car Marketplace</h1>
          <div style={{ opacity: 0.8 }}>Browse listings and contact sellers.</div>
        </div>

        <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          {!isAuthed ? (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          ) : (
            <>
              <span style={{ opacity: 0.8 }}>
                Hi, <b>{user?.name}</b> ({user?.role})
              </span>
              <Link to="/me">Profile</Link>
              <Link to="/my-listings">My listings</Link>
              <Link to="/my-enquiries">My enquiries</Link>
              <Link to="/received-enquiries">Received enquiries</Link>
              <Link to="/create-listing">Create listing</Link>
              <Link to="/favorites">Favorites</Link>
              <Link to="/compare">Compare</Link>
              {isAdmin ? <Link to="/admin">Admin</Link> : null}
              <button onClick={logout}>Logout</button>
            </>
          )}
        </div>
      </div>

      <div style={{ marginTop: 18, display: "grid", gap: 10, gridTemplateColumns: "2fr 1fr 1fr" }}>
        <input
          placeholder="Search (title/brand/model/location)"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          style={{ padding: 10 }}
        />
        <input
          placeholder="Brand (e.g. Hyundai)"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          style={{ padding: 10 }}
        />
        <select value={fuelType} onChange={(e) => setFuelType(e.target.value)} style={{ padding: 10 }}>
          <option value="">Any fuel</option>
          <option value="Petrol">Petrol</option>
          <option value="Diesel">Diesel</option>
          <option value="Electric">Electric</option>
        </select>
      </div>

      <div style={{ marginTop: 18 }}>
        {loading ? <p>Loading cars...</p> : null}
        {error ? <p style={{ color: "crimson" }}>{error}</p> : null}
        {!loading && !error && cars.length === 0 ? <p>No cars found.</p> : null}

        <div style={{ display: "grid", gap: 12 }}>
          {cars.map((car) => (
            <CarCard key={car._id} car={car} />
          ))}
        </div>
      </div>
    </div>
  );
}

