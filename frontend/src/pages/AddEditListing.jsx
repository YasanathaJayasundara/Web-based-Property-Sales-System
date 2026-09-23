import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createProperty, getPropertyById, updateProperty } from "../data/propertyApi";
import { useAuth } from "../context/AuthContext";

const emptyForm = {
  title: "",
  propertyType: "House",
  price: "",
  location: "",
  city: "",
  bedrooms: "0",
  bathrooms: "0",
  area: "",
  description: "",
  imageUrl: ""
};

export default function AddEditListing() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isEditing = Boolean(id);

  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEditing) return;

    async function loadProperty() {
      try {
        setLoading(true);
        setError("");
        const property = await getPropertyById(id);
        setForm({
          title: property.title ?? "",
          propertyType: property.propertyType ?? "House",
          price: property.price ?? "",
          location: property.location ?? "",
          city: property.city ?? "",
          bedrooms: property.bedrooms ?? "0",
          bathrooms: property.bathrooms ?? "0",
          area: property.area ?? "",
          description: property.description ?? "",
          imageUrl: property.imageUrl ?? ""
        });
      } catch (requestError) {
        setError(requestError.message);
      } finally {
        setLoading(false);
      }
    }

    loadProperty();
  }, [id, isEditing]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!form.title.trim() || !form.description.trim() || !form.location.trim()
      || !form.city.trim() || !form.price || !form.area) {
      setError("Please complete all required fields.");
      return;
    }

    const propertyData = {
      title: form.title.trim(),
      description: form.description.trim(),
      propertyType: form.propertyType,
      location: form.location.trim(),
      city: form.city.trim(),
      price: Number(form.price),
      bedrooms: Number(form.bedrooms || 0),
      bathrooms: Number(form.bathrooms || 0),
      area: Number(form.area),
      sellerId: Number(user?.databaseId ?? 2),
      imageUrl: form.imageUrl.trim() || null
    };

    try {
      setSaving(true);
      if (isEditing) await updateProperty(id, propertyData);
      else await createProperty(propertyData);
      navigate("/my-listings");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="container page"><div className="card card-pad center">Loading property...</div></div>;
  }

  return (
    <div className="container page" style={{ maxWidth: 700 }}>
      <h1>{isEditing ? "Edit Property" : "Add New Property"}</h1>
      <p className="muted">
        {isEditing ? "Update the property information below." : "The new property will be submitted with Pending status."}
      </p>

      <form onSubmit={handleSubmit} className="card card-pad mt-16">
        <div className="field">
          <label htmlFor="title">Property title *</label>
          <input id="title" name="title" value={form.title} onChange={handleChange}
            maxLength={120} placeholder="Modern 3BR House in Nugegoda" required />
        </div>

        <div className="field-row">
          <div className="field">
            <label htmlFor="propertyType">Property type *</label>
            <select id="propertyType" name="propertyType" value={form.propertyType} onChange={handleChange}>
              <option value="House">House</option>
              <option value="Apartment">Apartment</option>
              <option value="Land">Land</option>
              <option value="Commercial">Commercial</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="price">Price (LKR) *</label>
            <input id="price" name="price" type="number" min="1" step="0.01"
              value={form.price} onChange={handleChange} required />
          </div>
        </div>

        <div className="field-row">
          <div className="field">
            <label htmlFor="location">Location *</label>
            <input id="location" name="location" value={form.location}
              onChange={handleChange} maxLength={255} placeholder="Nugegoda" required />
          </div>
          <div className="field">
            <label htmlFor="city">City *</label>
            <input id="city" name="city" value={form.city}
              onChange={handleChange} maxLength={100} placeholder="Colombo" required />
          </div>
        </div>

        <div className="field-row">
          <div className="field">
            <label htmlFor="bedrooms">Bedrooms *</label>
            <input id="bedrooms" name="bedrooms" type="number" min="0"
              value={form.bedrooms} onChange={handleChange} required />
          </div>
          <div className="field">
            <label htmlFor="bathrooms">Bathrooms *</label>
            <input id="bathrooms" name="bathrooms" type="number" min="0"
              value={form.bathrooms} onChange={handleChange} required />
          </div>
        </div>

        <div className="field">
          <label htmlFor="area">Area (sq.ft) *</label>
          <input id="area" name="area" type="number" min="1" step="0.01"
            value={form.area} onChange={handleChange} required />
        </div>

        <div className="field">
          <label htmlFor="imageUrl">Image URL</label>
          <input id="imageUrl" name="imageUrl" type="url" value={form.imageUrl}
            onChange={handleChange} maxLength={500} placeholder="https://example.com/property.jpg" />
        </div>

        <div className="field">
          <label htmlFor="description">Description *</label>
          <textarea id="description" name="description" rows={6}
            value={form.description} onChange={handleChange} maxLength={2000} required />
        </div>

        {error && <div style={{ padding: 12, marginBottom: 16, color: "var(--danger)", background: "#fff1f0", borderRadius: 6 }}>{error}</div>}

        <div className="flex gap-12 mt-16">
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? "Saving..." : isEditing ? "Save Changes" : "Add Property"}
          </button>
          <button type="button" className="btn btn-outline" disabled={saving}
            onClick={() => navigate("/my-listings")}>Cancel</button>
        </div>
      </form>
    </div>
  );
}
