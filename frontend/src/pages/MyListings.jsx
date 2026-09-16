import React, { useState } from "react";
import { Link } from "react-router-dom";
import { LISTINGS, currency } from "../data/mockData";
import { useAuth } from "../context/AuthContext";

const statusClass = { Available: "badge-available", "Under Offer": "badge-underoffer", Sold: "badge-sold" };

export default function MyListings() {
  const { user } = useAuth();
  const [listings, setListings] = useState(LISTINGS);

  const mine = listings.filter((l) => l.ownerId === user.id || l.agentId === user.id);

  function handleDelete(id) {
    if (confirm("Delete this listing? This can't be undone.")) {
      setListings((prev) => prev.filter((l) => l.id !== id));
    }
  }

  return (
    <div className="container page">
      <div className="flex-between mb-16">
        <div>
          <h1>My Listings</h1>
          <p className="muted">Manage the properties you own or represent as an agent.</p>
        </div>
        <Link to="/my-listings/new" className="btn btn-primary">+ Add new listing</Link>
      </div>

      {mine.length === 0 ? (
        <div className="empty-state card card-pad">
          <h3>No listings yet</h3>
          <p>Add your first property to get it in front of buyers.</p>
          <Link to="/my-listings/new" className="btn btn-primary mt-16">Add new listing</Link>
        </div>
      ) : (
        <div className="card" style={{ overflow: "hidden" }}>
          <table>
            <thead>
              <tr>
                <th>Property</th>
                <th>Location</th>
                <th>Price</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {mine.map((l) => (
                <tr key={l.id}>
                  <td>
                    <div className="flex gap-12" style={{ alignItems: "center" }}>
                      <img src={l.photos[0]} alt="" style={{ width: 52, height: 40, objectFit: "cover", borderRadius: 6 }} />
                      <Link to={`/listings/${l.id}`} style={{ textDecoration: "none", fontWeight: 600 }}>{l.title}</Link>
                    </div>
                  </td>
                  <td className="muted">{l.location}</td>
                  <td>{currency(l.price)}</td>
                  <td><span className={`badge ${statusClass[l.status]}`}>{l.status}</span></td>
                  <td>
                    <div className="flex gap-8">
                      <Link to={`/my-listings/${l.id}/edit`} className="btn btn-outline btn-sm">Edit</Link>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(l.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
