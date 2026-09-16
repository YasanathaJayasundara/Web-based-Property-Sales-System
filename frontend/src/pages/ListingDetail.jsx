import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { findListing, findUser, currency, REVIEWS } from "../data/mockData";
import { useAuth } from "../context/AuthContext";
import StarRating from "../components/StarRating";

const statusClass = { Available: "badge-available", "Under Offer": "badge-underoffer", Sold: "badge-sold" };

export default function ListingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const listing = findListing(id);
  const [activePhoto, setActivePhoto] = useState(0);

  if (!listing) {
    return (
      <div className="container page">
        <div className="empty-state card card-pad">
          <h3>Listing not found</h3>
          <p>This property may have been removed. <Link to="/">Back to browse</Link></p>
        </div>
      </div>
    );
  }

  const agent = listing.agentId ? findUser(listing.agentId) : null;
  const reviews = REVIEWS.filter((r) => r.listingId === listing.id || r.agentId === listing.agentId);
  const avgRating = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : null;

  return (
    <div className="container page">
      <div className="mb-16">
        <Link to="/" className="muted" style={{ fontSize: "0.9rem", textDecoration: "none" }}>&larr; Back to listings</Link>
      </div>

      <div className="grid" style={{ gridTemplateColumns: "1.5fr 1fr", alignItems: "start" }}>
        <div>
          <div style={{ borderRadius: "var(--radius)", overflow: "hidden", aspectRatio: "16/10", background: "#eee" }}>
            <img src={listing.photos[activePhoto]} alt={listing.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          {listing.photos.length > 1 && (
            <div className="flex gap-8 mt-8">
              {listing.photos.map((p, i) => (
                <button key={i} onClick={() => setActivePhoto(i)} style={{ border: i === activePhoto ? "2px solid var(--gold)" : "2px solid transparent", padding: 0, borderRadius: 6, overflow: "hidden", width: 72, height: 54, cursor: "pointer" }}>
                  <img src={p} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </button>
              ))}
            </div>
          )}

          <div className="mt-24">
            <div className="flex-between">
              <h1>{listing.title}</h1>
              <span className={`badge ${statusClass[listing.status]}`}>{listing.status}</span>
            </div>
            <p className="muted">{listing.location}</p>
            <h2 style={{ color: "var(--navy)" }}>{currency(listing.price)}</h2>

            <div className="flex gap-16 mt-16" style={{ borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", padding: "14px 0" }}>
              {listing.bedrooms > 0 && <span><strong>{listing.bedrooms}</strong> <span className="muted">bed</span></span>}
              {listing.bathrooms > 0 && <span><strong>{listing.bathrooms}</strong> <span className="muted">bath</span></span>}
              <span><strong>{listing.area.toLocaleString()}</strong> <span className="muted">sq.ft</span></span>
              <span><strong>{listing.type}</strong></span>
            </div>

            <p className="mt-16">{listing.description}</p>
          </div>

          <div className="mt-32">
            <h2 style={{ fontSize: "1.15rem" }}>
              Reviews {avgRating && <span className="muted" style={{ fontWeight: 400, fontSize: "0.95rem" }}>&middot; {avgRating} average ({reviews.length})</span>}
            </h2>
            {reviews.length === 0 ? (
              <p className="muted">No reviews yet for this listing or agent.</p>
            ) : (
              <div className="flex" style={{ flexDirection: "column", gap: 16 }}>
                {reviews.map((r) => (
                  <div key={r.id} className="card card-pad">
                    <div className="flex-between">
                      <StarRating value={r.rating} />
                      <span className="muted" style={{ fontSize: "0.8rem" }}>{r.createdAt}</span>
                    </div>
                    <p className="mt-8" style={{ marginBottom: r.response ? 12 : 0 }}>{r.comment}</p>
                    {r.response && (
                      <div style={{ background: "var(--cream)", borderRadius: 8, padding: "10px 14px", fontSize: "0.9rem" }}>
                        <strong style={{ color: "var(--navy)" }}>Agent response: </strong>{r.response}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="card card-pad" style={{ position: "sticky", top: 24 }}>
          {agent && (
            <div className="mb-16" style={{ paddingBottom: 16, borderBottom: "1px solid var(--border)" }}>
              <p className="muted" style={{ fontSize: "0.8rem", marginBottom: 2 }}>Listed by</p>
              <strong>{agent.name}</strong>
              <p className="muted" style={{ fontSize: "0.85rem" }}>{agent.phone}</p>
            </div>
          )}

          {listing.status === "Sold" ? (
            <p className="muted">This property has been sold and is no longer accepting offers or appointments.</p>
          ) : user && user.role === "BUYER" ? (
            <div className="flex" style={{ flexDirection: "column", gap: 10 }}>
              <button className="btn btn-primary btn-block" onClick={() => navigate(`/appointments/new?listing=${listing.id}`)}>
                Request a viewing
              </button>
              <button className="btn btn-gold btn-block" onClick={() => navigate(`/offers/new?listing=${listing.id}`)}>
                Make an offer
              </button>
            </div>
          ) : user ? (
            <p className="muted">Log in as a buyer to request a viewing or make an offer.</p>
          ) : (
            <div className="flex" style={{ flexDirection: "column", gap: 10 }}>
              <p className="muted" style={{ marginTop: 0 }}>Log in to request a viewing or make an offer on this property.</p>
              <Link to="/login" className="btn btn-primary btn-block">Log in</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
