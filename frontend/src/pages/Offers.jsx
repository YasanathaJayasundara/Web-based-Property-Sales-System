import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  getAllOffers,
  getOffersByBuyer,
  getOffersBySeller,
  createOffer,
  respondToOffer,
  deleteOffer
} from "../data/offerApi";
import { getAllProperties } from "../data/propertyApi";
import { useAuth } from "../context/AuthContext";
import { OFFERS, LISTINGS, currency } from "../data/mockData";

const statusClass = {
  PENDING: "badge-pending",
  ACCEPTED: "badge-confirmed",
  REJECTED: "badge-rejected",
  COUNTERED: "badge-underoffer",
  WITHDRAWN: "badge-rejected"
};

export default function Offers() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [offers, setOffers] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Create Offer Modal
  const [showCreateModal, setShowCreateModal] = useState(window.location.pathname.endsWith("/new"));
  const [selectedPropertyId, setSelectedPropertyId] = useState(searchParams.get("listing") || "");
  const [newAmount, setNewAmount] = useState("");
  const [newMsg, setNewMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Counter Modal State
  const [counteringOffer, setCounteringOffer] = useState(null);
  const [counterAmount, setCounterAmount] = useState("");
  const [counterMsg, setCounterMsg] = useState("");

  async function loadData() {
    try {
      setLoading(true);
      setError("");
      const uid = user?.databaseId || user?.id;

      let list = [];
      if (user?.role === "SELLER") {
        list = await getOffersBySeller(uid || 4).catch(() => []);
      } else if (user?.role === "BUYER") {
        list = await getOffersByBuyer(uid || 3).catch(() => []);
      } else {
        list = await getAllOffers().catch(() => []);
      }

      const props = await getAllProperties().catch(() => LISTINGS);
      setProperties(props || []);

      if (list && list.length > 0) {
        setOffers(list);
      } else {
        // Fallback to sample seed
        setOffers(OFFERS.map(o => ({
          ...o,
          id: o.id.replace("o", ""),
          propertyTitle: props.find(p => p.id == o.listingId)?.title || "Modern 3BR House in Nugegoda",
          offerAmount: o.amount,
          buyerName: "Amara Fernando",
          status: o.status.toUpperCase(),
          history: o.history || []
        })));
      }
    } catch (err) {
      setError(err.message || "Failed to load offers");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [user]);

  async function handleCreateSubmit(e) {
    e.preventDefault();
    if (!selectedPropertyId || !newAmount) {
      setError("Please select a property and enter an offer amount.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      setSuccess("");

      const prop = properties.find(p => String(p.id) === String(selectedPropertyId)) || properties[0];
      const created = await createOffer({
        propertyId: prop?.id || 1,
        propertyTitle: prop?.title || "Property Offer",
        buyerId: user?.databaseId || user?.id || 3,
        buyerName: user?.name || "Buyer",
        sellerId: prop?.sellerId || 4,
        offerAmount: Number(newAmount),
        message: newMsg
      });

      setOffers((prev) => [created, ...prev]);
      setSuccess("Your offer was submitted to the seller!");
      setShowCreateModal(false);
      setNewAmount("");
      setNewMsg("");
    } catch (err) {
      setError(err.message || "Failed to create offer");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleRespond(offer, status, amount = null, msg = "") {
    try {
      setError("");
      setSuccess("");
      const actorRole = user?.role === "SELLER" ? "SELLER" : "BUYER";
      const updated = await respondToOffer(offer.id, {
        status,
        actorRole,
        counterAmount: amount ? Number(amount) : null,
        message: msg
      });

      setOffers((prev) => prev.map((o) => (o.id === offer.id ? updated : o)));
      setSuccess(`Offer updated to: ${status}.`);
      setCounteringOffer(null);
    } catch (err) {
      setError(err.message || "Failed to update offer");
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Withdraw and delete this offer?")) return;
    try {
      setError("");
      setSuccess("");
      await deleteOffer(id);
      setOffers((prev) => prev.filter((o) => o.id !== id));
      setSuccess("Offer withdrawn successfully.");
    } catch (err) {
      setError(err.message || "Failed to delete offer");
    }
  }

  return (
    <div className="container page">
      <div className="flex-between" style={{ alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
        <div>
          <span className="badge badge-accepted" style={{ marginBottom: 6, display: "inline-block" }}>
            Module 4 &middot; Halangoda R.W.W.M.M.C. (IT25102165)
          </span>
          <h1 style={{ margin: "4px 0" }}>Sales & Offer Management</h1>
          <p className="muted" style={{ margin: 0 }}>
            {user?.role === "SELLER"
              ? "Review offers received from buyers, accept terms, or submit counter-proposals."
              : "Submit offers on properties, negotiate purchase terms, and track acceptance."}
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
          + Submit New Offer
        </button>
      </div>

      {success && (
        <div style={{ padding: "12px 16px", marginTop: 16, background: "#d1e7dd", color: "#0f5132", borderRadius: 8, fontWeight: 500 }}>
          {success}
        </div>
      )}
      {error && (
        <div style={{ padding: "12px 16px", marginTop: 16, background: "#f8d7da", color: "#842029", borderRadius: 8, fontWeight: 500 }}>
          {error}
        </div>
      )}

      {loading ? (
        <div className="card card-pad center mt-24">Loading purchase offers...</div>
      ) : offers.length === 0 ? (
        <div className="empty-state card card-pad mt-24">
          <h3>No offers placed yet</h3>
          <p>{user?.role === "SELLER" ? "Offers from prospective buyers will appear here." : "Browse listings and submit an offer to begin negotiation."}</p>
          <Link to="/" className="btn btn-primary mt-16">Browse Properties</Link>
        </div>
      ) : (
        <div className="flex mt-24" style={{ flexDirection: "column", gap: 14 }}>
          {offers.map((o) => {
            const isCountering = counteringOffer?.id === o.id;
            return (
              <div key={o.id} className="card card-pad">
                <div className="flex-between" style={{ alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
                  <div>
                    <h3 style={{ margin: "0 0 4px" }}>
                      <Link to={`/listings/${o.propertyId}`} style={{ textDecoration: "none", color: "var(--navy)" }}>
                        {o.propertyTitle}
                      </Link>
                    </h3>
                    <p style={{ margin: "4px 0", fontSize: "1.1rem" }}>
                      Current Offer: <strong style={{ color: "var(--navy)" }}>{currency(o.offerAmount)}</strong>
                      {o.initialAmount && o.initialAmount !== o.offerAmount && (
                        <span className="muted" style={{ fontSize: "0.85rem", marginLeft: 8 }}>
                          (Initial: {currency(o.initialAmount)})
                        </span>
                      )}
                    </p>
                    <p className="muted" style={{ margin: "2px 0", fontSize: "0.85rem" }}>
                      Buyer: <strong>{o.buyerName}</strong> &middot; ID: #{o.id}
                    </p>
                    {o.message && (
                      <p style={{ margin: "6px 0 0", fontSize: "0.88rem", color: "#444", background: "#f8f9fa", padding: 8, borderRadius: 6 }}>
                        &ldquo;{o.message}&rdquo;
                      </p>
                    )}
                  </div>

                  <div className="flex gap-8" style={{ alignItems: "center", flexWrap: "wrap" }}>
                    <span className={`badge ${statusClass[o.status] || "badge-pending"}`}>{o.status}</span>

                    {/* If Offer is Accepted, Buyer can proceed to Payment */}
                    {o.status === "ACCEPTED" && user?.role === "BUYER" && (
                      <Link to="/payments" className="btn btn-gold btn-sm">
                        Pay 10% Deposit &rarr;
                      </Link>
                    )}

                    {/* Negotiation Controls for Pending/Countered */}
                    {(o.status === "PENDING" || o.status === "COUNTERED") && (
                      <>
                        <button className="btn btn-primary btn-sm" onClick={() => handleRespond(o, "ACCEPTED")}>
                          Accept Offer
                        </button>
                        <button
                          className="btn btn-outline btn-sm"
                          onClick={() => {
                            setCounteringOffer(isCountering ? null : o);
                            setCounterAmount(o.offerAmount);
                          }}
                        >
                          Counter Offer
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleRespond(o, "REJECTED")}>
                          Reject
                        </button>
                      </>
                    )}

                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(o.id)}>
                      Withdraw
                    </button>
                  </div>
                </div>

                {/* Counter-offer inline box */}
                {isCountering && (
                  <div style={{ marginTop: 16, padding: 14, background: "#fcf8ee", borderRadius: 8, border: "1px solid #ebd9a9" }}>
                    <h4 style={{ margin: "0 0 8px" }}>Submit Counter Proposal</h4>
                    <div className="flex gap-12" style={{ alignItems: "center", flexWrap: "wrap" }}>
                      <input
                        type="number"
                        placeholder="Counter Amount (LKR)"
                        value={counterAmount}
                        onChange={(e) => setCounterAmount(e.target.value)}
                        style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid #ccc", width: 200 }}
                      />
                      <input
                        type="text"
                        placeholder="Counter note/terms"
                        value={counterMsg}
                        onChange={(e) => setCounterMsg(e.target.value)}
                        style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid #ccc", flex: 1, minWidth: 200 }}
                      />
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleRespond(o, "COUNTERED", counterAmount, counterMsg)}
                      >
                        Send Counter
                      </button>
                      <button className="btn btn-outline btn-sm" onClick={() => setCounteringOffer(null)}>
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Offer Negotiation History */}
                {o.history && o.history.length > 0 && (
                  <div style={{ marginTop: 14, paddingTop: 10, borderTop: "1px solid #eee", fontSize: "0.82rem" }}>
                    <span className="muted" style={{ fontWeight: 600 }}>Negotiation Log:</span>
                    <ul style={{ margin: "4px 0 0", paddingLeft: 18, color: "#666" }}>
                      {o.history.map((h, i) => (
                        <li key={i}>
                          <strong>{h.actorRole}</strong>: {h.action?.replace("_", " ")} &mdash; {currency(h.amount)} {h.note ? `("${h.note}")` : ""}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Create Offer Modal */}
      {showCreateModal && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 9999, padding: 16
        }}>
          <div className="card card-pad" style={{ width: "100%", maxWidth: 500, background: "white" }}>
            <div className="flex-between mb-16">
              <h2 style={{ margin: 0 }}>Submit Purchase Offer</h2>
              <button className="btn btn-outline btn-sm" onClick={() => setShowCreateModal(false)}>✕</button>
            </div>

            <form onSubmit={handleCreateSubmit}>
              <div className="field">
                <label>Target Property *</label>
                <select
                  required
                  value={selectedPropertyId}
                  onChange={(e) => {
                    setSelectedPropertyId(e.target.value);
                    const p = properties.find(prop => String(prop.id) === String(e.target.value));
                    if (p?.price) setNewAmount(p.price);
                  }}
                >
                  <option value="">-- Choose a Property --</option>
                  {properties.map((p) => (
                    <option key={p.id} value={p.id}>{p.title} - {currency(p.price)}</option>
                  ))}
                </select>
              </div>

              <div className="field">
                <label>Offer Amount (LKR) *</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 42000000"
                  value={newAmount}
                  onChange={(e) => setNewAmount(e.target.value)}
                />
              </div>

              <div className="field">
                <label>Message / Terms for Seller</label>
                <textarea
                  rows={3}
                  placeholder="e.g. Offering Rs. 42M subject to satisfactory deed inspection..."
                  value={newMsg}
                  onChange={(e) => setNewMsg(e.target.value)}
                />
              </div>

              <div className="flex gap-12 mt-16" style={{ justifyContent: "flex-end" }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowCreateModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? "Submitting\u2026" : "Submit Offer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
