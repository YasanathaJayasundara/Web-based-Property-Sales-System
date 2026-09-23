import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { deleteProperty, getAllProperties } from "../data/propertyApi";

function formatCurrency(value) {
  return new Intl.NumberFormat("en-LK", {
    style: "currency", currency: "LKR", maximumFractionDigits: 0
  }).format(Number(value) || 0);
}

function formatStatus(status) {
  return status ? status.toLowerCase().replaceAll("_", " ").replace(/\b\w/g, (c) => c.toUpperCase()) : "Unknown";
}

function getImage(property) {
  return property.imageUrl || property.images?.[0]?.imageUrl || property.images?.[0]?.url || "";
}

export default function MyListings() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadProperties() {
    try {
      setLoading(true);
      setError("");
      setProperties((await getAllProperties()) ?? []);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadProperties(); }, []);

  async function handleDelete(id, title) {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      setDeletingId(id);
      setError("");
      setSuccess("");
      await deleteProperty(id);
      setProperties((current) => current.filter((property) => property.id !== id));
      setSuccess("Property deleted successfully.");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="container page">
      <div className="flex-between mb-16">
        <div>
          <h1>All Property Listings</h1>
          <p className="muted">Add, view, edit and delete properties stored in SQL Server.</p>
        </div>
        <Link to="/my-listings/new" className="btn btn-primary">+ Add New Property</Link>
      </div>

      {success && <div style={{ padding: 12, marginBottom: 16, color: "#146c43", background: "#d1e7dd", borderRadius: 6 }}>{success}</div>}
      {error && <div style={{ padding: 12, marginBottom: 16, color: "var(--danger)", background: "#fff1f0", borderRadius: 6 }}>{error}</div>}

      {loading ? (
        <div className="card card-pad center">Loading properties from the database...</div>
      ) : properties.length === 0 ? (
        <div className="empty-state card card-pad">
          <h3>No database properties found</h3>
          <p>Add your first property. It will be stored in dbo.properties.</p>
          <Link to="/my-listings/new" className="btn btn-primary mt-16">Add New Property</Link>
        </div>
      ) : (
        <div className="card" style={{ overflowX: "auto" }}>
          <table>
            <thead><tr><th>Property</th><th>Type</th><th>Location</th><th>Price</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {properties.map((property) => {
                const image = getImage(property);
                return (
                  <tr key={property.id}>
                    <td>
                      <div className="flex gap-12" style={{ alignItems: "center" }}>
                        {image ? <img src={image} alt={property.title} style={{ width: 52, height: 40, objectFit: "cover", borderRadius: 6 }} />
                          : <div style={{ width: 52, height: 40, display: "grid", placeItems: "center", borderRadius: 6, background: "#e9efec", fontSize: ".7rem" }}>No image</div>}
                        <div>
                          <Link to={`/listings/${property.id}`} style={{ textDecoration: "none", fontWeight: 600 }}>{property.title}</Link>
                          <div className="muted" style={{ fontSize: ".75rem" }}>ID: {property.id}</div>
                        </div>
                      </div>
                    </td>
                    <td>{property.propertyType}</td>
                    <td className="muted">{property.location}, {property.city}</td>
                    <td>{formatCurrency(property.price)}</td>
                    <td><span className="badge badge-available">{formatStatus(property.status)}</span></td>
                    <td>
                      <div className="flex gap-8">
                        <Link to={`/listings/${property.id}`} className="btn btn-outline btn-sm">View</Link>
                        <Link to={`/my-listings/${property.id}/edit`} className="btn btn-outline btn-sm">Edit</Link>
                        <button type="button" className="btn btn-danger btn-sm" disabled={deletingId === property.id}
                          onClick={() => handleDelete(property.id, property.title)}>
                          {deletingId === property.id ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
