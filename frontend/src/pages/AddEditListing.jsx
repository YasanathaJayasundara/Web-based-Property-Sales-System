import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { findListing } from "../data/mockData";

const emptyForm = { title: "", type: "House", price: "", location: "", bedrooms: "", bathrooms: "", area: "", description: "", status: "Available" };

export default function AddEditListing() {
  const { id } = useParams();
  const navigate = useNavigate();
  const existing = id ? findListing(id) : null;

  const [form, setForm] = useState(existing ? { ...existing } : emptyForm);
  const [photos, setPhotos] = useState(existing ? existing.photos.length : 0);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.title || !form.price || !form.location) {
      setError("Please fill in the property title, price, and location before submitting.");
      return;
    }
    if (photos === 0) {
      setError("Please upload at least one photo of the property.");
      return;
    }
    setError("");
    // Real app: POST/PUT to /api/listings (Spring Boot), multipart upload for photos.
    setSaved(true);
  }

  if (saved) {
    return (
      <div className="container page" style={{ maxWidth: 480 }}>
        <div className="card card-pad center">
          <h2>{existing ? "Listing updated" : "Listing created"}</h2>
          <p>{form.title} {existing ? "has been updated." : "is now saved with status: Available, and visible to buyers."}</p>
          <button className="btn btn-primary mt-16" onClick={() => navigate("/my-listings")}>Back to My Listings</button>
        </div>
      </div>
    );
  }

  return (
    <div className="container page" style={{ maxWidth: 640 }}>
      <h1>{existing ? "Edit listing" : "Add new listing"}</h1>
      <p className="muted">{existing ? "Update the details for this property." : "Fill in the details below to publish a new property listing."}</p>

      <form onSubmit={handleSubmit} className="card card-pad mt-16">
        <div className="field">
          <label htmlFor="title">Property title</label>
          <input id="title" required value={form.title} onChange={(e) => update("title", e.target.value)} placeholder="e.g. Modern 3BR House in Nugegoda" />
        </div>

        <div className="field-row">
          <div className="field">
            <label htmlFor="type">Property type</label>
            <select id="type" value={form.type} onChange={(e) => update("type", e.target.value)}>
              <option>House</option>
              <option>Apartment</option>
              <option>Land</option>
              <option>Commercial</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="price">Price (Rs.)</label>
            <input id="price" type="number" required value={form.price} onChange={(e) => update("price", e.target.value)} />
          </div>
        </div>

        <div className="field">
          <label htmlFor="location">Location</label>
          <input id="location" required value={form.location} onChange={(e) => update("location", e.target.value)} placeholder="e.g. Nugegoda, Colombo" />
        </div>

        {form.type !== "Land" && form.type !== "Commercial" && (
          <div className="field-row">
            <div className="field">
              <label htmlFor="bedrooms">Bedrooms</label>
              <input id="bedrooms" type="number" value={form.bedrooms} onChange={(e) => update("bedrooms", e.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="bathrooms">Bathrooms</label>
              <input id="bathrooms" type="number" value={form.bathrooms} onChange={(e) => update("bathrooms", e.target.value)} />
            </div>
          </div>
        )}

        <div className="field">
          <label htmlFor="area">Area (sq.ft)</label>
          <input id="area" type="number" value={form.area} onChange={(e) => update("area", e.target.value)} />
        </div>

        <div className="field">
          <label htmlFor="description">Description</label>
          <textarea id="description" rows={5} value={form.description} onChange={(e) => update("description", e.target.value)} placeholder="Describe the property's condition, features, and surroundings" />
        </div>

        <div className="field">
          <label>Photos</label>
          <div
            style={{ border: "2px dashed var(--border)", borderRadius: 8, padding: "24px", textAlign: "center", cursor: "pointer" }}
            onClick={() => setPhotos((p) => p + 1)}
          >
            <p className="muted" style={{ margin: 0 }}>
              {photos === 0 ? "Click to simulate a photo upload" : `${photos} photo${photos > 1 ? "s" : ""} attached \u2014 click to add another`}
            </p>
          </div>
          <p className="field-hint">In the full application, this uploads image files to storage and attaches the URLs to the listing.</p>
        </div>

        {existing && (
          <div className="field">
            <label htmlFor="status">Listing status</label>
            <select id="status" value={form.status} onChange={(e) => update("status", e.target.value)}>
              <option>Available</option>
              <option>Under Offer</option>
              <option>Sold</option>
            </select>
          </div>
        )}

        {error && <p style={{ color: "var(--danger)", fontSize: "0.88rem" }}>{error}</p>}

        <div className="flex gap-12 mt-16">
          <button type="submit" className="btn btn-primary">{existing ? "Save changes" : "Publish listing"}</button>
          <button type="button" className="btn btn-outline" onClick={() => navigate("/my-listings")}>Cancel</button>
        </div>
      </form>
    </div>
  );
}
