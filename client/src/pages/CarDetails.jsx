import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { apiFetch } from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function CarDetails() {
  const { id } = useParams();
  const { isAuthed, isBuyer, user } = useAuth();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sentOk, setSentOk] = useState(false);
  const [bidAmount, setBidAmount] = useState("");
  const [bidding, setBidding] = useState(false);
  const [bids, setBids] = useState([]);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentType, setPaymentType] = useState("Full");
  const [downPayment, setDownPayment] = useState("");
  const [installmentMonths, setInstallmentMonths] = useState("12");
  const [paymentSubmitting, setPaymentSubmitting] = useState(false);
  const [deliveryType, setDeliveryType] = useState("Pickup");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [deliverySubmitting, setDeliverySubmitting] = useState(false);
  const [showDamage, setShowDamage] = useState(false);
  const [damageDesc, setDamageDesc] = useState("");
  const [damageAmount, setDamageAmount] = useState("");
  const [damageSubmitting, setDamageSubmitting] = useState(false);

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
    return () => { ignore = true; };
  }, [id]);

  useEffect(() => {
    if (!car?.isAuction) return;
    let ignore = false;
    apiFetch(`/bids/${car._id}`)
      .then((data) => { if (!ignore) setBids(data.bids || []); })
      .catch(() => {});
    return () => { ignore = true; };
  }, [car?._id, car?.isAuction]);

  if (loading) return <p className="text-muted-app">Loading…</p>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!car) return <p className="text-muted-app">Car not found.</p>;

  return (
    <>
      <Link to="/" className="btn btn-outline-secondary btn-sm mb-3">
        ← Back to listings
      </Link>

      <div className="card mb-4">
        <div className="card-body">
          <h1 className="h4 card-title mb-2">{car.title}</h1>
          <p className="small text-muted-app mb-2">
            {car.brand} {car.model} · {car.year} · {car.fuelType} · {car.transmission}
          </p>
          <p className="mb-2">
            <strong>₹{car.price?.toLocaleString()}</strong> · {car.mileage} km · {car.location}
            {car.numberOfOwners != null && (
              <> · {car.numberOfOwners === 1 ? "1st" : car.numberOfOwners === 2 ? "2nd" : `${car.numberOfOwners}th`} owner</>
            )}
            {car.isAuction && (
              <span className="badge bg-warning text-dark ms-2">Auction</span>
            )}
            {car.deliveryAvailable && (
              <span className="badge bg-info ms-1">Delivery · ₹{car.deliveryCharge?.toLocaleString()}</span>
            )}
          </p>
          {car.isAuction && (
            <p className="small text-muted-app mb-0">
              Starting bid: ₹{car.startingBid?.toLocaleString()} · Current highest: ₹{(car.currentHighestBid ?? car.startingBid)?.toLocaleString()}
              {car.auctionEndDate && ` · Ends: ${new Date(car.auctionEndDate).toLocaleString()}`}
            </p>
          )}
          <p className="small mb-0">
            Seller: <strong>{car.sellerId?.name}</strong> · {car.sellerId?.email}
            {car.sellerId?.phoneNumber ? ` · ${car.sellerId.phoneNumber}` : ""}
          </p>
        </div>
      </div>

      {car.images?.length > 0 && (
        <div className="d-flex flex-wrap gap-2 mb-4">
          {car.images.map((src) => (
            <img
              key={src}
              src={src}
              alt="Car"
              className="rounded"
              style={{ width: 220, height: 140, objectFit: "cover" }}
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          ))}
        </div>
      )}

      {car.isAuction && isAuthed && String(car.sellerId?._id) !== String(user?.id) && car.isAvailable && (
        <div className="card mb-4">
          <div className="card-body">
            <h2 className="h6 mb-3">Place bid</h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setError("");
                setBidding(true);
                try {
                  await apiFetch("/bids", {
                    method: "POST",
                    auth: true,
                    body: { carId: car._id, bidAmount: Number(bidAmount) },
                  });
                  setBidAmount("");
                  const data = await apiFetch(`/cars/${id}`);
                  setCar(data.car);
                  const bidData = await apiFetch(`/bids/${car._id}`);
                  setBids(bidData.bids || []);
                } catch (err) {
                  setError(err.message);
                } finally {
                  setBidding(false);
                }
              }}
            >
              <div className="d-flex gap-2 align-items-end flex-wrap">
                <div className="flex-grow-1" style={{ minWidth: 140 }}>
                  <label htmlFor="bid-amount" className="form-label small">Bid amount (₹)</label>
                  <input
                    id="bid-amount"
                    type="number"
                    className="form-control"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    min={(car.currentHighestBid || car.startingBid) + 1}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary" disabled={bidding}>
                  {bidding ? "Placing…" : "Place bid"}
                </button>
              </div>
            </form>
            {bids.length > 0 && (
              <p className="small text-muted-app mt-2 mb-0">
                {bids.length} bid(s) · Highest: ₹{Math.max(...bids.map((b) => b.bidAmount))?.toLocaleString()}
              </p>
            )}
          </div>
        </div>
      )}

      <div className="card mb-4">
        <div className="card-body">
          <h2 className="h6 mb-3">Contact seller</h2>
          {!isAuthed ? (
            <p className="text-muted-app mb-0">
              Please <Link to="/login">log in</Link> to send an enquiry.
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
            >
              {sentOk && (
                <div className="alert alert-success py-2 small mb-3">Enquiry sent.</div>
              )}
              <div className="mb-3">
                <label htmlFor="enquiry-msg" className="form-label">Message</label>
                <textarea
                  id="enquiry-msg"
                  className="form-control"
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write your message to the seller…"
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary" disabled={sending}>
                {sending ? "Sending…" : "Send enquiry"}
              </button>
            </form>
          )}
        </div>
      </div>

      {isAuthed && isBuyer && String(car.sellerId?._id) !== String(user?.id) && car.isAvailable && (
        <>
          <div className="card mb-4">
            <div className="card-body">
              <h2 className="h6 mb-3">Payment &amp; delivery</h2>
              {!showPayment ? (
                <button type="button" className="btn btn-outline-primary btn-sm" onClick={() => setShowPayment(true)}>
                  Proceed to payment / delivery
                </button>
              ) : (
                <>
                  <div className="mb-3">
                    <label className="form-label">Payment</label>
                    <select className="form-select" value={paymentType} onChange={(e) => setPaymentType(e.target.value)}>
                      <option value="Full">Full payment</option>
                      <option value="Installment">Installment (EMI)</option>
                    </select>
                  </div>
                  {paymentType === "Installment" && (
                    <div className="row g-2 mb-3">
                      <div className="col-6">
                        <label className="form-label small">Down payment (₹)</label>
                        <input type="number" className="form-control" value={downPayment} onChange={(e) => setDownPayment(e.target.value)} min="0" />
                      </div>
                      <div className="col-6">
                        <label className="form-label small">Months</label>
                        <input type="number" className="form-control" value={installmentMonths} onChange={(e) => setInstallmentMonths(e.target.value)} min="1" />
                      </div>
                    </div>
                  )}
                  <div className="mb-3">
                    <label className="form-label">Delivery</label>
                    <select className="form-select" value={deliveryType} onChange={(e) => setDeliveryType(e.target.value)}>
                      <option value="Pickup">Onsite pickup</option>
                      <option value="HomeDelivery">Home delivery</option>
                    </select>
                  </div>
                  {deliveryType === "HomeDelivery" && (
                    <div className="mb-3">
                      <label className="form-label">Delivery address</label>
                      <textarea className="form-control" rows={2} value={deliveryAddress} onChange={(e) => setDeliveryAddress(e.target.value)} required />
                    </div>
                  )}
                  <div className="d-flex gap-2">
                    <button
                      type="button"
                      className="btn btn-primary"
                      disabled={paymentSubmitting || deliverySubmitting}
                      onClick={async () => {
                        setPaymentSubmitting(true);
                        setError("");
                        try {
                          await apiFetch("/payments", {
                            method: "POST",
                            auth: true,
                            body: {
                              carId: car._id,
                              totalAmount: car.price,
                              paymentType,
                              downPayment: paymentType === "Installment" ? Number(downPayment) : 0,
                              installmentMonths: paymentType === "Installment" ? Number(installmentMonths) : 0,
                            },
                          });
                          await apiFetch("/delivery", {
                            method: "POST",
                            auth: true,
                            body: { carId: car._id, deliveryType, deliveryAddress: deliveryType === "HomeDelivery" ? deliveryAddress : "" },
                          });
                          setShowPayment(false);
                        } catch (err) {
                          setError(err.message);
                        } finally {
                          setPaymentSubmitting(false);
                        }
                      }}
                    >
                      {paymentSubmitting ? "Submitting…" : "Create payment & delivery"}
                    </button>
                    <button type="button" className="btn btn-outline-secondary" onClick={() => setShowPayment(false)}>Cancel</button>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="card mb-4">
            <div className="card-body">
              <h2 className="h6 mb-3">Report damage</h2>
              {!showDamage ? (
                <button type="button" className="btn btn-outline-warning btn-sm" onClick={() => setShowDamage(true)}>
                  Request price reduction (damage)
                </button>
              ) : (
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setDamageSubmitting(true);
                    setError("");
                    try {
                      await apiFetch("/damage", {
                        method: "POST",
                        auth: true,
                        body: {
                          carId: car._id,
                          description: damageDesc,
                          requestedReductionAmount: Number(damageAmount),
                        },
                      });
                      setDamageDesc("");
                      setDamageAmount("");
                      setShowDamage(false);
                    } catch (err) {
                      setError(err.message);
                    } finally {
                      setDamageSubmitting(false);
                    }
                  }}
                >
                  <div className="mb-2">
                    <label className="form-label small">Description</label>
                    <textarea className="form-control" rows={2} value={damageDesc} onChange={(e) => setDamageDesc(e.target.value)} required />
                  </div>
                  <div className="mb-2">
                    <label className="form-label small">Requested reduction (₹)</label>
                    <input type="number" className="form-control" value={damageAmount} onChange={(e) => setDamageAmount(e.target.value)} min="0" required />
                  </div>
                  <div className="d-flex gap-2">
                    <button type="submit" className="btn btn-warning btn-sm" disabled={damageSubmitting}>Submit</button>
                    <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => setShowDamage(false)}>Cancel</button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
