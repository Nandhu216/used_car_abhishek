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
    <div className="card h-100">
      <div className="card-body d-flex flex-column">
        <div className="d-flex justify-content-between gap-3">
          <div className="flex-grow-1 min-w-0">
            <h3 className="h6 card-title mb-2 text-truncate">{car.title}</h3>
            <p className="small text-muted-app mb-1">
              {car.brand} {car.model} · {car.year} · {car.fuelType} · {car.transmission}
            </p>
            <p className="small mb-0">
              <strong>₹{car.price?.toLocaleString()}</strong> · {car.mileage} km · {car.location}
              {car.isAuction && <span className="badge bg-warning text-dark ms-1">Auction</span>}
            </p>
          </div>
          {car.images?.[0] ? (
            <img
              src={car.images[0]}
              alt={car.title}
              className="rounded flex-shrink-0"
              style={{ width: 120, height: 80, objectFit: "cover" }}
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          ) : null}
        </div>
        <div className="mt-3 d-flex flex-wrap gap-2 align-items-center">
          <Link to={`/cars/${car._id}`} className="btn btn-primary btn-sm">
            View details
          </Link>
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm"
            onClick={() => toggle(FAVORITES_KEY, fav, setFav)}
          >
            {fav ? "Unfavorite" : "Favorite"}
          </button>
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm"
            onClick={() => toggle(COMPARE_KEY, cmp, setCmp, 4)}
          >
            {cmp ? "Remove compare" : "Compare"}
          </button>
          <span className="small text-muted-app ms-auto">
            Seller: {car.sellerId?.name || "—"}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
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
    <>
      <h1 className="h4 mb-4">Browse listings</h1>

      <div className="row g-3 mb-4">
        <div className="col-12 col-md-5">
          <input
            type="search"
            className="form-control"
            placeholder="Search (title, brand, model, location)"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <div className="col-6 col-md-3">
          <input
            type="text"
            className="form-control"
            placeholder="Brand"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
          />
        </div>
        <div className="col-6 col-md-2">
          <select
            className="form-select"
            value={fuelType}
            onChange={(e) => setFuelType(e.target.value)}
          >
            <option value="">Any fuel</option>
            <option value="Petrol">Petrol</option>
            <option value="Diesel">Diesel</option>
            <option value="Electric">Electric</option>
          </select>
        </div>
      </div>

      {loading && <p className="text-muted-app">Loading…</p>}
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      {!loading && !error && cars.length === 0 && (
        <p className="text-muted-app">No cars found.</p>
      )}

      <div className="row g-3">
        {cars.map((car) => (
          <div key={car._id} className="col-12 col-sm-6 col-lg-4">
            <CarCard car={car} />
          </div>
        ))}
      </div>
    </>
  );
}
