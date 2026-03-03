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
  const [transmission, setTransmission] = useState("");
  const [location, setLocation] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minYear, setMinYear] = useState("");
  const [maxYear, setMaxYear] = useState("");
  const [isAvailable, setIsAvailable] = useState("");

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (brand) params.set("brand", brand);
    if (fuelType) params.set("fuelType", fuelType);
    if (transmission) params.set("transmission", transmission);
    if (location) params.set("location", location);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (minYear) params.set("minYear", minYear);
    if (maxYear) params.set("maxYear", maxYear);
    if (isAvailable) params.set("isAvailable", isAvailable);
    return params.toString();
  }, [q, brand, fuelType, transmission, location, minPrice, maxPrice, minYear, maxYear, isAvailable]);

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

  const hasFilters = q || brand || fuelType || transmission || location || minPrice || maxPrice || minYear || maxYear || isAvailable;
  function clearFilters() {
    setQ("");
    setBrand("");
    setFuelType("");
    setTransmission("");
    setLocation("");
    setMinPrice("");
    setMaxPrice("");
    setMinYear("");
    setMaxYear("");
    setIsAvailable("");
  }

  const activeCount = [q, brand, fuelType, transmission, location, minPrice, maxPrice, minYear, maxYear, isAvailable].filter(Boolean).length;

  return (
    <>
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
        <h1 className="h4 mb-0">Browse listings</h1>
        <div className="dropdown" data-bs-auto-close="outside">
          <button
            className="btn btn-outline-primary dropdown-toggle"
            type="button"
            id="browseFiltersDropdown"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            Filters
            {activeCount > 0 && (
              <span className="badge bg-primary ms-1">{activeCount}</span>
            )}
          </button>
          <div
            className="dropdown-menu dropdown-menu-end p-3 shadow-sm"
            style={{ minWidth: "320px", maxWidth: "420px" }}
            aria-labelledby="browseFiltersDropdown"
          >
            <h2 className="h6 mb-3">Filter by</h2>
            <div className="d-flex flex-column gap-3">
              <div>
                <label className="form-label small text-muted mb-1">Search</label>
                <input
                  type="search"
                  className="form-control form-control-sm"
                  placeholder="Title, brand, model, location…"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                />
              </div>
              <div className="row g-2">
                <div className="col-6">
                  <label className="form-label small text-muted mb-1">Brand</label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="Any"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                  />
                </div>
                <div className="col-6">
                  <label className="form-label small text-muted mb-1">Location</label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="Any"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
              </div>
              <div className="row g-2">
                <div className="col-6">
                  <label className="form-label small text-muted mb-1">Fuel type</label>
                  <select
                    className="form-select form-select-sm"
                    value={fuelType}
                    onChange={(e) => setFuelType(e.target.value)}
                  >
                    <option value="">Any</option>
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Electric">Electric</option>
                  </select>
                </div>
                <div className="col-6">
                  <label className="form-label small text-muted mb-1">Transmission</label>
                  <select
                    className="form-select form-select-sm"
                    value={transmission}
                    onChange={(e) => setTransmission(e.target.value)}
                  >
                    <option value="">Any</option>
                    <option value="Manual">Manual</option>
                    <option value="Automatic">Automatic</option>
                  </select>
                </div>
              </div>
              <div className="row g-2">
                <div className="col-6">
                  <label className="form-label small text-muted mb-1">Min price (₹)</label>
                  <input
                    type="number"
                    className="form-control form-control-sm"
                    placeholder="Min"
                    min="0"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                  />
                </div>
                <div className="col-6">
                  <label className="form-label small text-muted mb-1">Max price (₹)</label>
                  <input
                    type="number"
                    className="form-control form-control-sm"
                    placeholder="Max"
                    min="0"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                  />
                </div>
              </div>
              <div className="row g-2">
                <div className="col-6">
                  <label className="form-label small text-muted mb-1">Min year</label>
                  <input
                    type="number"
                    className="form-control form-control-sm"
                    placeholder="e.g. 2015"
                    value={minYear}
                    onChange={(e) => setMinYear(e.target.value)}
                  />
                </div>
                <div className="col-6">
                  <label className="form-label small text-muted mb-1">Max year</label>
                  <input
                    type="number"
                    className="form-control form-control-sm"
                    placeholder="e.g. 2024"
                    value={maxYear}
                    onChange={(e) => setMaxYear(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="form-label small text-muted mb-1">Availability</label>
                <select
                  className="form-select form-control-sm"
                  value={isAvailable}
                  onChange={(e) => setIsAvailable(e.target.value)}
                >
                  <option value="">All</option>
                  <option value="true">Available only</option>
                  <option value="false">Sold only</option>
                </select>
              </div>
              {hasFilters && (
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm align-self-start"
                  onClick={clearFilters}
                >
                  Clear filters
                </button>
              )}
            </div>
          </div>
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
