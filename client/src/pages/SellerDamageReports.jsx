import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../api/client";

export default function SellerDamageReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [responding, setResponding] = useState(null);
  const [responseStatus, setResponseStatus] = useState("");
  const [responsePrice, setResponsePrice] = useState("");
  const [responseText, setResponseText] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const data = await apiFetch("/damage/seller", { auth: true });
      setReports(data.damageReports || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function submitResponse(id) {
    if (!responseStatus) return;
    setError("");
    try {
      await apiFetch(`/damage/${id}`, {
        method: "PUT",
        auth: true,
        body: {
          status: responseStatus,
          finalAgreedPrice: responsePrice ? Number(responsePrice) : undefined,
          sellerResponse: responseText,
        },
      });
      setResponding(null);
      setResponseStatus("");
      setResponsePrice("");
      setResponseText("");
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) return <p className="text-muted-app">Loading…</p>;

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h4 mb-0">Damage reports</h1>
        <Link to="/" className="btn btn-outline-secondary btn-sm">Back</Link>
      </div>
      {error && <div className="alert alert-danger">{error}</div>}
      {reports.length === 0 ? (
        <p className="text-muted-app">No damage reports on your listings.</p>
      ) : (
        <div className="card">
          <div className="list-group list-group-flush">
            {reports.map((r) => (
              <div key={r._id} className="list-group-item">
                <h2 className="h6 mb-1">
                  <Link to={`/cars/${r.carId?._id}`}>{r.carId?.title}</Link>
                </h2>
                <p className="small text-muted-app mb-1">
                  Buyer: {r.buyerId?.name} · Requested reduction: ₹{r.requestedReductionAmount?.toLocaleString()} ·{" "}
                  <span className="badge bg-secondary">{r.status}</span>
                </p>
                <p className="small mb-2">{r.description}</p>
                {r.status === "Pending" && (
                  <>
                    {responding === r._id ? (
                      <div className="border rounded p-2 bg-light">
                        <select
                          className="form-select form-select-sm mb-2"
                          value={responseStatus}
                          onChange={(e) => setResponseStatus(e.target.value)}
                        >
                          <option value="">Choose…</option>
                          <option value="Accepted">Accept</option>
                          <option value="Rejected">Reject</option>
                          <option value="Countered">Counter offer</option>
                        </select>
                        {(responseStatus === "Accepted" || responseStatus === "Countered") && (
                          <input
                            type="number"
                            className="form-control form-control-sm mb-2"
                            placeholder="Agreed price (₹)"
                            value={responsePrice}
                            onChange={(e) => setResponsePrice(e.target.value)}
                          />
                        )}
                        <textarea
                          className="form-control form-control-sm mb-2"
                          rows={2}
                          placeholder="Your response"
                          value={responseText}
                          onChange={(e) => setResponseText(e.target.value)}
                        />
                        <div className="d-flex gap-1">
                          <button
                            type="button"
                            className="btn btn-primary btn-sm"
                            onClick={() => submitResponse(r._id)}
                          >
                            Submit
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline-secondary btn-sm"
                            onClick={() => {
                              setResponding(null);
                              setResponseStatus("");
                              setResponsePrice("");
                              setResponseText("");
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => setResponding(r._id)}
                      >
                        Respond
                      </button>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
