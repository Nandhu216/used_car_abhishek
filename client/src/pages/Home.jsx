import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../api/client";
import { useAuth } from "../context/AuthContext";

const FAVORITES_KEY = "favorites";
const COMPARE_KEY = "compare";
const BODY_TYPES = ["All", "SUV", "Hatchback", "Sedan", "MUV", "Luxury"];

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

/* ── Hero Section ── */
function HeroSection({ featuredCar }) {
  return (
    <section className="ad-hero">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-5 ad-hero-content">
            <h1 className="ad-hero-title">
              {featuredCar
                ? `${featuredCar.brand} ${featuredCar.model}`
                : "Find Your Dream Car"}
              <br />
              <span style={{ color: "var(--ad-text-muted)", fontSize: "0.6em" }}>
                {featuredCar ? `${featuredCar.year} ${featuredCar.fuelType === "Electric" ? "EV" : featuredCar.fuelType}` : "Browse Listings"}
              </span>
            </h1>
            <p className="ad-hero-desc">
              {featuredCar
                ? `${featuredCar.title} — ${featuredCar.transmission}, ${featuredCar.mileage?.toLocaleString()} km, ${featuredCar.location}`
                : "Discover a wide range of quality cars at the best prices. Browse, compare, and find the perfect match."}
            </p>
            {featuredCar ? (
              <Link to={`/cars/${featuredCar._id}`} className="ad-hero-btn">
                Reserve now
              </Link>
            ) : (
              <span className="ad-hero-btn" style={{ opacity: 0.7 }}>Browse below</span>
            )}

            {/* Stat cards */}
            {featuredCar && (
              <div className="ad-hero-stats">
                <div className="ad-stat-card">
                  <div className="ad-stat-label">Price</div>
                  <div className="ad-stat-value">₹{(featuredCar.price / 100000).toFixed(1)}L</div>
                  <div className="ad-stat-sub">Best Value</div>
                </div>
                <div className="ad-stat-card">
                  <div className="ad-stat-label">Mileage</div>
                  <div className="ad-stat-value">{(featuredCar.mileage / 1000).toFixed(0)}k</div>
                  <div className="ad-stat-sub">Kilometers</div>
                </div>
                <div className="ad-stat-card">
                  <div className="ad-stat-label">Year</div>
                  <div className="ad-stat-value">{featuredCar.year}</div>
                  <div className="ad-stat-sub">Model Year</div>
                </div>
                <div className="ad-stat-card">
                  <div className="ad-stat-label">Owners</div>
                  <div className="ad-stat-value">{featuredCar.numberOfOwners ?? 1}</div>
                  <div className="ad-stat-sub">{featuredCar.numberOfOwners === 1 ? "1st Owner" : "Previous Owners"}</div>
                </div>
              </div>
            )}
          </div>
          <div className="col-lg-7 ad-hero-image d-none d-lg-block">
            {featuredCar?.images?.[0] ? (
              <img src={featuredCar.images[0]} alt={featuredCar.title} />
            ) : (
              <div style={{ fontSize: "8rem", color: "var(--ad-text-muted)", opacity: 0.2 }}>
                <i className="bi bi-car-front-fill" />
              </div>
            )}
            {/* Side action buttons */}
            <div className="ad-hero-actions d-none d-xl-flex">
              <div className="ad-hero-action-btn">
                <span>Discover<br />More</span>
                <div className="ad-hero-action-icon"><i className="bi bi-plus" /></div>
              </div>
              <div className="ad-hero-action-btn">
                <span>Explore<br />Details</span>
                <div className="ad-hero-action-icon"><i className="bi bi-eye" /></div>
              </div>
            </div>
            {/* Nav arrows */}
            <div className="ad-hero-nav">
              <button className="ad-hero-arrow"><i className="bi bi-chevron-left" /></button>
              <button className="ad-hero-arrow"><i className="bi bi-chevron-right" /></button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Car Card (new design) ── */
function CarCard({ car }) {
  const [fav, setFav] = useState(false);
  const [cmp, setCmp] = useState(false);

  useEffect(() => {
    setFav(loadIds(FAVORITES_KEY).includes(car._id));
    setCmp(loadIds(COMPARE_KEY).includes(car._id));
  }, [car._id]);

  function toggle(key, current, setter, max) {
    const ids = loadIds(key);
    if (current) {
      saveIds(key, ids.filter((x) => x !== car._id));
      setter(false);
      return;
    }
    const next = ids.includes(car._id) ? ids : [...ids, car._id];
    if (max && next.length > max) return;
    saveIds(key, next);
    setter(true);
  }

  return (
    <div className="ad-car-card">
      {/* Image */}
      <div className="ad-car-img-wrap">
        {car.images?.[0] ? (
          <img src={car.images[0]} alt={car.title} onError={(e) => { e.currentTarget.style.display = "none"; }} />
        ) : (
          <div className="ad-car-img-placeholder">
            <i className="bi bi-car-front" />
          </div>
        )}
        {/* Badges */}
        <div className="ad-car-badges">
          {car.isAuction && <span className="ad-badge-featured">Auction</span>}
          <span className="ad-badge-year">{car.year}</span>
        </div>
        {car.images?.length > 1 && (
          <div className="ad-badge-photos">
            <i className="bi bi-images" /> {car.images.length}
          </div>
        )}
        {/* Hover action buttons */}
        <div className="ad-car-actions">
          <button
            className={`ad-car-action-btn ${cmp ? "active" : ""}`}
            title={cmp ? "Remove from compare" : "Compare"}
            onClick={(e) => { e.preventDefault(); toggle(COMPARE_KEY, cmp, setCmp, 4); }}
          >
            <i className="bi bi-arrow-left-right" />
          </button>
          <button
            className={`ad-car-action-btn ${fav ? "active" : ""}`}
            title={fav ? "Remove from favorites" : "Add to favorites"}
            onClick={(e) => { e.preventDefault(); toggle(FAVORITES_KEY, fav, setFav); }}
          >
            <i className={fav ? "bi bi-heart-fill" : "bi bi-heart"} />
          </button>
        </div>
      </div>
      {/* Body */}
      <div className="ad-car-body">
        <div className="ad-car-type">
          {car.fuelType}
          {car.isAuction && <span className="ad-car-auction-badge">Auction</span>}
        </div>
        <div className="ad-car-title">
          <Link to={`/cars/${car._id}`}>{car.title}</Link>
        </div>
        <div className="ad-car-specs">
          <span><i className="bi bi-speedometer2" /> {car.mileage?.toLocaleString()} km</span>
          <span><i className="bi bi-fuel-pump" /> {car.fuelType}</span>
          <span><i className="bi bi-gear" /> {car.transmission}</span>
        </div>
        <div className="ad-car-price">₹{car.price?.toLocaleString()}</div>
      </div>
    </div>
  );
}

/* ── Home Page ── */
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
  const [category, setCategory] = useState("all");
  const [bodyType, setBodyType] = useState("All");

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
    return () => { ignore = true; };
  }, [queryString]);

  const hasFilters = q || brand || fuelType || transmission || location || minPrice || maxPrice || minYear || maxYear || isAvailable;
  function clearFilters() {
    setQ(""); setBrand(""); setFuelType(""); setTransmission("");
    setLocation(""); setMinPrice(""); setMaxPrice("");
    setMinYear(""); setMaxYear(""); setIsAvailable("");
  }

  const activeCount = [q, brand, fuelType, transmission, location, minPrice, maxPrice, minYear, maxYear, isAvailable].filter(Boolean).length;

  /* Client-side filtering for category pills and body-type tabs */
  const filteredCars = useMemo(() => {
    let result = cars;
    if (category === "auction") result = result.filter((c) => c.isAuction);
    else if (category === "regular") result = result.filter((c) => !c.isAuction);
    if (bodyType !== "All") {
      const bt = bodyType.toLowerCase();
      result = result.filter((c) =>
        (c.bodyType || "").toLowerCase() === bt ||
        (c.brand || "").toLowerCase().includes(bt) ||
        (c.title || "").toLowerCase().includes(bt)
      );
    }
    return result;
  }, [cars, category, bodyType]);

  const featuredCar = cars[0] || null;

  return (
    <>
      {/* Hero */}
      <HeroSection featuredCar={featuredCar} />

      {/* Category Pills */}
      <div className="ad-category-pills">
        <button className={`ad-pill ${category === "all" ? "active" : ""}`} onClick={() => setCategory("all")}>All car</button>
        <button className={`ad-pill ${category === "regular" ? "active" : ""}`} onClick={() => setCategory("regular")}>Regular</button>
        <button className={`ad-pill ${category === "auction" ? "active" : ""}`} onClick={() => setCategory("auction")}>Auction</button>
      </div>

      {/* Main content area */}
      <div className="ad-section-container">
        {/* Type Tabs + Filter button row */}
        <div className="d-flex justify-content-between align-items-end flex-wrap gap-2">
          <div className="ad-type-tabs" style={{ borderBottom: "none", marginBottom: 0, paddingBottom: "0.5rem" }}>
            {BODY_TYPES.map((t) => (
              <button
                key={t}
                className={`ad-type-tab ${bodyType === t ? "active" : ""}`}
                onClick={() => setBodyType(t)}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="dropdown mb-2" data-bs-auto-close="outside">
            <button
              className="btn btn-outline-primary btn-sm dropdown-toggle"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i className="bi bi-funnel me-1" />
              Filters
              {activeCount > 0 && <span className="badge bg-primary ms-1">{activeCount}</span>}
            </button>
            <div className="dropdown-menu dropdown-menu-end p-3" style={{ minWidth: 320, maxWidth: 420 }}>
              <h2 className="h6 mb-3" style={{ color: "#fff" }}>Filter by</h2>
              <div className="d-flex flex-column gap-3">
                <div>
                  <label className="form-label small mb-1">Search</label>
                  <input type="search" className="form-control form-control-sm" placeholder="Title, brand, model, location…" value={q} onChange={(e) => setQ(e.target.value)} />
                </div>
                <div className="row g-2">
                  <div className="col-6">
                    <label className="form-label small mb-1">Brand</label>
                    <input type="text" className="form-control form-control-sm" placeholder="Any" value={brand} onChange={(e) => setBrand(e.target.value)} />
                  </div>
                  <div className="col-6">
                    <label className="form-label small mb-1">Location</label>
                    <input type="text" className="form-control form-control-sm" placeholder="Any" value={location} onChange={(e) => setLocation(e.target.value)} />
                  </div>
                </div>
                <div className="row g-2">
                  <div className="col-6">
                    <label className="form-label small mb-1">Fuel type</label>
                    <select className="form-select form-select-sm" value={fuelType} onChange={(e) => setFuelType(e.target.value)}>
                      <option value="">Any</option>
                      <option value="Petrol">Petrol</option>
                      <option value="Diesel">Diesel</option>
                      <option value="Electric">Electric</option>
                    </select>
                  </div>
                  <div className="col-6">
                    <label className="form-label small mb-1">Transmission</label>
                    <select className="form-select form-select-sm" value={transmission} onChange={(e) => setTransmission(e.target.value)}>
                      <option value="">Any</option>
                      <option value="Manual">Manual</option>
                      <option value="Automatic">Automatic</option>
                    </select>
                  </div>
                </div>
                <div className="row g-2">
                  <div className="col-6">
                    <label className="form-label small mb-1">Min price (₹)</label>
                    <input type="number" className="form-control form-control-sm" placeholder="Min" min="0" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
                  </div>
                  <div className="col-6">
                    <label className="form-label small mb-1">Max price (₹)</label>
                    <input type="number" className="form-control form-control-sm" placeholder="Max" min="0" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
                  </div>
                </div>
                <div className="row g-2">
                  <div className="col-6">
                    <label className="form-label small mb-1">Min year</label>
                    <input type="number" className="form-control form-control-sm" placeholder="e.g. 2015" value={minYear} onChange={(e) => setMinYear(e.target.value)} />
                  </div>
                  <div className="col-6">
                    <label className="form-label small mb-1">Max year</label>
                    <input type="number" className="form-control form-control-sm" placeholder="e.g. 2024" value={maxYear} onChange={(e) => setMaxYear(e.target.value)} />
                  </div>
                </div>
                <div>
                  <label className="form-label small mb-1">Availability</label>
                  <select className="form-select form-select-sm" value={isAvailable} onChange={(e) => setIsAvailable(e.target.value)}>
                    <option value="">All</option>
                    <option value="true">Available only</option>
                    <option value="false">Sold only</option>
                  </select>
                </div>
                {hasFilters && (
                  <button type="button" className="btn btn-outline-secondary btn-sm align-self-start" onClick={clearFilters}>
                    Clear filters
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <hr style={{ borderColor: "rgba(255,255,255,0.08)", margin: "0 0 1.5rem" }} />

        {/* Listings */}
        {loading && <p className="text-muted-app py-4 text-center">Loading…</p>}
        {error && <div className="alert alert-danger" role="alert">{error}</div>}
        {!loading && !error && filteredCars.length === 0 && (
          <p className="text-muted-app py-4 text-center">No cars found.</p>
        )}

        <div className="row g-3 pb-4">
          {filteredCars.map((car) => (
            <div key={car._id} className="col-12 col-sm-6 col-lg-4 col-xl-3">
              <CarCard car={car} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
