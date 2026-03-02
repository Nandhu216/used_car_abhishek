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
  const [numberOfOwners, setNumberOfOwners] = useState("1");
  const [imagesText, setImagesText] = useState("");
  const [isAuction, setIsAuction] = useState(false);
  const [startingBid, setStartingBid] = useState("");
  const [auctionEndDate, setAuctionEndDate] = useState("");
  const [deliveryAvailable, setDeliveryAvailable] = useState(false);
  const [deliveryCharge, setDeliveryCharge] = useState("0");

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
          numberOfOwners: Number(numberOfOwners) || 1,
          images,
          isAuction,
          startingBid: isAuction && startingBid ? Number(startingBid) : undefined,
          auctionEndDate: isAuction && auctionEndDate ? auctionEndDate : undefined,
          deliveryAvailable,
          deliveryCharge: deliveryAvailable ? Number(deliveryCharge) || 0 : 0,
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
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h4 mb-0">Create listing</h1>
        <Link to="/" className="btn btn-outline-secondary btn-sm">
          Back
        </Link>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className="card">
        <div className="card-body">
          <form onSubmit={onSubmit}>
            <div className="mb-3">
              <label htmlFor="car-title" className="form-label">
                Title
              </label>
              <input
                id="car-title"
                type="text"
                className="form-control"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <label htmlFor="car-brand" className="form-label">
                  Brand
                </label>
                <input
                  id="car-brand"
                  type="text"
                  className="form-control"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  required
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="car-model" className="form-label">
                  Model
                </label>
                <input
                  id="car-model"
                  type="text"
                  className="form-control"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="row g-3 mb-3">
              <div className="col-6 col-md-4">
                <label htmlFor="car-year" className="form-label">
                  Year
                </label>
                <input
                  id="car-year"
                  type="number"
                  className="form-control"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  required
                />
              </div>
              <div className="col-6 col-md-4">
                <label htmlFor="car-price" className="form-label">
                  Price (₹)
                </label>
                <input
                  id="car-price"
                  type="number"
                  className="form-control"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </div>
              <div className="col-6 col-md-4">
                <label htmlFor="car-mileage" className="form-label">
                  Mileage (km)
                </label>
                <input
                  id="car-mileage"
                  type="number"
                  className="form-control"
                  value={mileage}
                  onChange={(e) => setMileage(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="mb-3 d-flex flex-wrap gap-2 align-items-center">
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                onClick={getRecommendation}
              >
                Get price recommendation
              </button>
              {rec?.recommendedPrice && (
                <span className="small text-muted-app">
                  Suggested: <strong>₹{rec.recommendedPrice.toLocaleString()}</strong>
                </span>
              )}
            </div>

            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <label htmlFor="car-fuel" className="form-label">
                  Fuel type
                </label>
                <select
                  id="car-fuel"
                  className="form-select"
                  value={fuelType}
                  onChange={(e) => setFuelType(e.target.value)}
                >
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Electric">Electric</option>
                </select>
              </div>
              <div className="col-md-6">
                <label htmlFor="car-trans" className="form-label">
                  Transmission
                </label>
                <select
                  id="car-trans"
                  className="form-select"
                  value={transmission}
                  onChange={(e) => setTransmission(e.target.value)}
                >
                  <option value="Manual">Manual</option>
                  <option value="Automatic">Automatic</option>
                </select>
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="car-location" className="form-label">
                Location
              </label>
              <input
                id="car-location"
                type="text"
                className="form-control"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="car-owners" className="form-label">
                Current ownership number
              </label>
              <input
                id="car-owners"
                type="number"
                min={1}
                className="form-control"
                value={numberOfOwners}
                onChange={(e) => setNumberOfOwners(e.target.value)}
                placeholder="e.g. 1 = first owner, 2 = second owner"
              />
              <div className="form-text">Number of previous owners (1 = first owner).</div>
            </div>

            <div className="mb-4">
              <label htmlFor="car-images" className="form-label">
                Image URLs <span className="text-muted-app small">(one per line)</span>
              </label>
              <textarea
                id="car-images"
                className="form-control font-monospace small"
                rows={3}
                value={imagesText}
                onChange={(e) => setImagesText(e.target.value)}
                placeholder="https://…"
              />
            </div>

            <hr className="my-4" />
            <h3 className="h6 mb-3">Auction &amp; delivery</h3>
            <div className="mb-3 form-check">
              <input
                id="car-auction"
                type="checkbox"
                className="form-check-input"
                checked={isAuction}
                onChange={(e) => setIsAuction(e.target.checked)}
              />
              <label htmlFor="car-auction" className="form-check-label">Enable auction mode</label>
            </div>
            {isAuction && (
              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label htmlFor="car-starting-bid" className="form-label">Starting bid (₹)</label>
                  <input
                    id="car-starting-bid"
                    type="number"
                    className="form-control"
                    value={startingBid}
                    onChange={(e) => setStartingBid(e.target.value)}
                    min="0"
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="car-auction-end" className="form-label">Auction end date</label>
                  <input
                    id="car-auction-end"
                    type="datetime-local"
                    className="form-control"
                    value={auctionEndDate}
                    onChange={(e) => setAuctionEndDate(e.target.value)}
                  />
                </div>
              </div>
            )}
            <div className="mb-3 form-check">
              <input
                id="car-delivery"
                type="checkbox"
                className="form-check-input"
                checked={deliveryAvailable}
                onChange={(e) => setDeliveryAvailable(e.target.checked)}
              />
              <label htmlFor="car-delivery" className="form-check-label">Delivery available</label>
            </div>
            {deliveryAvailable && (
              <div className="mb-3">
                <label htmlFor="car-delivery-charge" className="form-label">Delivery charge (₹)</label>
                <input
                  id="car-delivery-charge"
                  type="number"
                  min="0"
                  className="form-control"
                  value={deliveryCharge}
                  onChange={(e) => setDeliveryCharge(e.target.value)}
                />
              </div>
            )}

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Creating…" : "Create listing"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
