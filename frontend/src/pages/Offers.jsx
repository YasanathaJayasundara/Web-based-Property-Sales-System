import React, { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { OFFERS, LISTINGS, findListing, currency } from "../data/mockData";
import { useAuth } from "../context/AuthContext";

const statusClass = { Pending: "badge-pending", Accepted: "badge-accepted", Rejected: "badge-rejected", Countered: "badge-underoffer" };

export default function Offers() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const isNew = window.location.pathname.endsWith("/new");
  const [offers, setOffers] = useState(OFFERS);
  const [listings, setListings] = useState(LISTINGS);
  const [counterValue, setCounterValue] = useState({});

  const mine = user.role === "SELLER"
    ? offers.filter((o) => findListing(o.listingId)?.ownerId === user.id)
    : offers.filter((o) => o.buyerId === user.id);

  function respond(id, status, counterAmount) {
    setOffers((prev) => prev.map((o) => {
      if (o.id !== id) return o;
      const entry = status === "Countered"
        ? { by: "Seller", amount: Number(counterAmount), note: "Countered" }
        : { by: "Seller", amount: o.amount, note: status };
      return { ...o, status, amount: status === "Countered" ? Number(counterAmount) : o.amount, history: [...o.history, entry] };
    }));
    if (status === "Accepted") {
      const offer = offers.find((o) => o.id === id);
      setListings((prev) => prev.map((l) => (l.id === offer.listingId ? { ...l, status: "Under Offer" } : l)));
    }
  }

  if (isNew) {
    return <NewOffer listingId={searchParams.get("listing")} onCreate={(o) => setOffers((prev) => [...prev, o])} />;
  }

  return (
    <div className="container page">
      <h1>Offers</h1>
      <p className="muted">{user.role === "SELLER" ? "Offers received on your listings." : "Offers you've submitted."}</p>

      {mine.length === 0 ? (
        <div className="empty-state card card-pad">
          <h3>No offers yet</h3>
          <p>{user.role === "SELLER" ? "Offers from buyers will appear here." : "Browse listings and make an offer to get started."}</p>
          {user.role !== "SELLER" && <Link to="/" className="btn btn-primary mt-16">Browse listings</Link>}
        </div>
      ) : (
        <div className="flex" style={{ flexDirection: "column", gap: 12 }}>
          {mine.map((o) => {
            const listing = findListing(o.listingId);
            return (
              <div key={o.id} className="card card-pad">
                <div className="flex-between">
                  <div>
                    <Link to={`/listings/${listing.id}`} style={{ fontWeight: 600, textDecoration: "none" }}>{listing.title}</Link>
                    <p className="muted" style={{ margin: "2px 0" }}>Current offer: <strong style={{ color: "var(--ink)" }}>{currency(o.amount)}</strong></p>
                  </div>
                  <span className={`badge ${statusClass[o.status]}`}>{o.status}</span>
                </div>

                {o.message && <p style={{ fontSize: "0.9rem", fontStyle: "italic" }}>&ldquo;{o.message}&rdquo;</p>}

                <details className="mt-8">
                  <summary className="muted" style={{ cursor: "pointer", fontSize: "0.85rem" }}>Negotiation history ({o.history.length})</summary>
                  <ul style={{ fontSize: "0.85rem", paddingLeft: 18 }}>
                    {o.history.map((h, i) => <li key={i}>{h.by}: {currency(h.amount)} &mdash; {h.note}</li>)}
                  </ul>
                </details>

                {user.role === "SELLER" && o.status === "Pending" && (
                  <div className="flex gap-8 mt-16" style={{ alignItems: "center" }}>
                    <button className="btn btn-primary btn-sm" onClick={() => respond(o.id, "Accepted")}>Accept</button>
                    <button className="btn btn-danger btn-sm" onClick={() => respond(o.id, "Rejected")}>Reject</button>
                    <input
                      type="number"
                      placeholder="Counter amount"
                      style={{ width: 150, padding: "0.4em 0.6em", border: "1px solid var(--border)", borderRadius: 6 }}
                      value={counterValue[o.id] || ""}
                      onChange={(e) => setCounterValue((v) => ({ ...v, [o.id]: e.target.value }))}
                    />
                    <button
                      className="btn btn-outline btn-sm"
                      disabled={!counterValue[o.id]}
                      onClick={() => respond(o.id, "Countered", counterValue[o.id])}
                    >
                      Send counter
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function NewOffer({ listingId, onCreate }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const listing = findListing(listingId) || LISTINGS[0];
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) {
      setError("Please enter a valid offer amount.");
      return;
    }
    onCreate({
      id: "o" + Date.now(),
      listingId: listing.id,
      buyerId: user.id,
      amount: Number(amount),
      status: "Pending",
      message,
      history: [{ by: "Buyer", amount: Number(amount), note: "Initial offer" }],
    });
    navigate("/offers");
  }

  return (
    <div className="container page" style={{ maxWidth: 480 }}>
      <h1>Make an offer</h1>
      <p className="muted">Property: <strong>{listing.title}</strong> &middot; Listed at {currency(listing.price)}</p>

      <form onSubmit={handleSubmit} className="card card-pad mt-16">
        <div className="field">
          <label htmlFor="amount">Offer amount (Rs.)</label>
          <input id="amount" type="number" required value={amount} onChange={(e) => setAmount(e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="message">Message to seller (optional)</label>
          <textarea id="message" rows={3} value={message} onChange={(e) => setMessage(e.target.value)} />
        </div>
        {error && <p style={{ color: "var(--danger)", fontSize: "0.88rem" }}>{error}</p>}
        <button type="submit" className="btn btn-primary btn-block">Submit offer</button>
      </form>
    </div>
  );
}
