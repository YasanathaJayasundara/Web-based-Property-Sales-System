import React from "react";
import { Link } from "react-router-dom";
import { currency } from "../data/mockData";

const statusClass = {
  Available: "badge-available",
  "Under Offer": "badge-underoffer",
  Sold: "badge-sold",
};

export default function ListingCard({ listing }) {
  return (
    <Link to={`/listings/${listing.id}`} className="card" style={{ textDecoration: "none", color: "inherit", overflow: "hidden", display: "block" }}>
      <div style={{ position: "relative", aspectRatio: "4/3", background: "#eee" }}>
        <img
          src={listing.photos[0]}
          alt={listing.title}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          loading="lazy"
        />
        <span className={`badge ${statusClass[listing.status]}`} style={{ position: "absolute", top: 10, left: 10 }}>
          {listing.status}
        </span>
      </div>
      <div style={{ padding: "14px 16px" }}>
        <h3 style={{ marginBottom: 2, fontSize: "1.02rem" }}>{listing.title}</h3>
        <p className="muted" style={{ fontSize: "0.85rem", margin: "0 0 8px" }}>{listing.location}</p>
        <div className="flex-between">
          <strong style={{ color: "var(--navy)" }}>{currency(listing.price)}</strong>
          <span className="muted" style={{ fontSize: "0.8rem" }}>
            {listing.type === "Land" || listing.type === "Commercial"
              ? `${listing.area.toLocaleString()} sq.ft`
              : `${listing.bedrooms} bed \u00b7 ${listing.bathrooms} bath`}
          </span>
        </div>
      </div>
    </Link>
  );
}
