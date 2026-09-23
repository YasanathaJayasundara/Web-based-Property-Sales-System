import React, { useEffect, useState } from "react";
import {
  getAllPromotions,
  createPromotion,
  updatePromotion,
  togglePromotionStatus,
  deletePromotion,
  validatePromoCode
} from "../data/reportPromoApi";
import { useAuth } from "../context/AuthContext";

export default function Promotions() {
  const { user } = useAuth();
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Modal / Form state
  const [showModal, setShowModal] = useState(false);
  const [editingPromo, setEditingPromo] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    promoCode: "",
    discountType: "PERCENTAGE",
    discountValue: "",
    bannerImageUrl: "",
    targetUrl: "",
    targetPropertyType: "All",
    placement: "HERO_BANNER",
    status: "ACTIVE",
    startDate: new Date().toISOString().slice(0, 10),
    endDate: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
    createdBy: user?.name || "Shavindi T.D.P.",
  });

  // Promo code testing tool state
  const [testCode, setTestCode] = useState("");
  const [testPrice, setTestPrice] = useState("30000000");
  const [testResult, setTestResult] = useState(null);
  const [testing, setTesting] = useState(false);

  async function loadPromotions() {
    try {
      setLoading(true);
      setError("");
      const data = await getAllPromotions();
      setPromotions(data || []);
    } catch (err) {
      setError(err.message || "Failed to load promotions");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPromotions();
  }, []);

  function handleOpenCreate() {
    setEditingPromo(null);
    setFormData({
      title: "",
      description: "",
      promoCode: "",
      discountType: "PERCENTAGE",
      discountValue: "",
      bannerImageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200",
      targetUrl: "/",
      targetPropertyType: "All",
      placement: "HERO_BANNER",
      status: "ACTIVE",
      startDate: new Date().toISOString().slice(0, 10),
      endDate: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
      createdBy: user?.name || "Shavindi T.D.P.",
    });
    setShowModal(true);
  }

  function handleOpenEdit(promo) {
    setEditingPromo(promo);
    setFormData({
      title: promo.title,
      description: promo.description,
      promoCode: promo.promoCode,
      discountType: promo.discountType || "PERCENTAGE",
      discountValue: promo.discountValue || "",
      bannerImageUrl: promo.bannerImageUrl || "",
      targetUrl: promo.targetUrl || "",
      targetPropertyType: promo.targetPropertyType || "All",
      placement: promo.placement || "HERO_BANNER",
      status: promo.status || "ACTIVE",
      startDate: promo.startDate ? promo.startDate.slice(0, 10) : "",
      endDate: promo.endDate ? promo.endDate.slice(0, 10) : "",
      createdBy: promo.createdBy || "Shavindi T.D.P.",
    });
    setShowModal(true);
  }

  async function handleSubmitForm(e) {
    e.preventDefault();
    try {
      setError("");
      setSuccess("");
      const payload = {
        ...formData,
        discountValue: Number(formData.discountValue),
      };

      if (editingPromo) {
        const updated = await updatePromotion(editingPromo.id, payload);
        setPromotions((prev) => prev.map((p) => (p.id === editingPromo.id ? updated : p)));
        setSuccess(`Promotion "${updated.title}" updated successfully.`);
      } else {
        const created = await createPromotion(payload);
        setPromotions((prev) => [created, ...prev]);
        setSuccess(`Promotion campaign "${created.title}" launched successfully!`);
      }
      setShowModal(false);
    } catch (err) {
      setError(err.message || "Operation failed");
    }
  }

  async function handleToggleStatus(promo) {
    try {
      const updated = await togglePromotionStatus(promo.id);
      setPromotions((prev) => prev.map((p) => (p.id === promo.id ? updated : p)));
      setSuccess(`Promotion status changed to ${updated.status}.`);
    } catch (err) {
      setError(err.message || "Failed to toggle status");
    }
  }

  async function handleDelete(promo) {
    if (!window.confirm(`Delete promotion campaign "${promo.title}" (${promo.promoCode})?`)) return;
    try {
      await deletePromotion(promo.id);
      setPromotions((prev) => prev.filter((p) => p.id !== promo.id));
      setSuccess(`Promotion deleted.`);
    } catch (err) {
      setError(err.message || "Failed to delete promotion");
    }
  }

  async function handleTestCode(e) {
    e.preventDefault();
    if (!testCode) return;
    try {
      setTesting(true);
      setTestResult(null);
      const res = await validatePromoCode(testCode, Number(testPrice));
      setTestResult(res);
    } catch (err) {
      setTestResult({ valid: false, message: err.message });
    } finally {
      setTesting(false);
    }
  }

  // Summary statistics
  const totalCampaigns = promotions.length;
  const activeCampaigns = promotions.filter((p) => p.status === "ACTIVE").length;
  const totalImpressions = promotions.reduce((s, p) => s + (p.impressionCount || 0), 0);
  const totalClicks = promotions.reduce((s, p) => s + (p.clickCount || 0), 0);
  const avgCtr = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(1) : "0.0";

  return (
    <div className="container page">
      <div className="flex-between" style={{ alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
        <div>
          <span className="badge badge-accepted" style={{ marginBottom: 6, display: "inline-block" }}>
            Module 5 &middot; Shavindi T.D.P. (IT25200808)
          </span>
          <h1 style={{ margin: "4px 0" }}>Advertisements & Promotions Management</h1>
          <p className="muted" style={{ margin: 0 }}>
            Create promotional banners, configure discount promo codes, track placement CTR, and drive sales.
          </p>
        </div>
        <button className="btn btn-primary" onClick={handleOpenCreate}>
          + Create New Ad Campaign
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

      {/* KPI Cards */}
      <div className="grid grid-3 mt-24" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
        <div className="card card-pad">
          <p className="muted" style={{ margin: 0, fontSize: "0.85rem" }}>Active Campaigns</p>
          <h2 style={{ margin: "4px 0 0", color: "var(--navy)" }}>{activeCampaigns} / {totalCampaigns}</h2>
        </div>
        <div className="card card-pad">
          <p className="muted" style={{ margin: 0, fontSize: "0.85rem" }}>Total Ad Impressions</p>
          <h2 style={{ margin: "4px 0 0", color: "var(--navy)" }}>{totalImpressions.toLocaleString()}</h2>
        </div>
        <div className="card card-pad">
          <p className="muted" style={{ margin: 0, fontSize: "0.85rem" }}>Total Banner Clicks</p>
          <h2 style={{ margin: "4px 0 0", color: "var(--gold)" }}>{totalClicks.toLocaleString()}</h2>
        </div>
        <div className="card card-pad">
          <p className="muted" style={{ margin: 0, fontSize: "0.85rem" }}>Avg. Click-Through Rate (CTR)</p>
          <h2 style={{ margin: "4px 0 0", color: "var(--green, #2e7d32)" }}>{avgCtr}%</h2>
        </div>
      </div>

      {/* Interactive Promo Code Verification Tool */}
      <div className="card card-pad mt-24" style={{ background: "linear-gradient(135deg, #fdfbf7 0%, #f4ede1 100%)", border: "1px solid #e2d7c5" }}>
        <h3 style={{ margin: "0 0 8px", color: "var(--navy)" }}>⚡ Live Promo Code Simulator</h3>
        <p className="muted" style={{ margin: "0 0 16px", fontSize: "0.9rem" }}>
          Test how promotional discounts apply against buyer property purchases.
        </p>
        <form onSubmit={handleTestCode} className="flex gap-12" style={{ alignItems: "center", flexWrap: "wrap" }}>
          <input
            type="text"
            placeholder="Enter Code (e.g. FESTIVE5, LUXURY250K)"
            value={testCode}
            onChange={(e) => setTestCode(e.target.value)}
            style={{ padding: "8px 12px", borderRadius: 6, border: "1px solid var(--border)", minWidth: 240 }}
          />
          <input
            type="number"
            placeholder="Property Price (LKR)"
            value={testPrice}
            onChange={(e) => setTestPrice(e.target.value)}
            style={{ padding: "8px 12px", borderRadius: 6, border: "1px solid var(--border)", width: 180 }}
          />
          <button type="submit" className="btn btn-gold btn-sm" disabled={testing}>
            {testing ? "Validating\u2026" : "Test Code"}
          </button>
        </form>

        {testResult && (
          <div style={{
            marginTop: 14,
            padding: 12,
            borderRadius: 6,
            background: testResult.valid ? "#e8f5e9" : "#ffebee",
            border: `1px solid ${testResult.valid ? "#c8e6c9" : "#ffcdd2"}`
          }}>
            <p style={{ margin: 0, fontWeight: 600, color: testResult.valid ? "#2e7d32" : "#c62828" }}>
              {testResult.message}
            </p>
            {testResult.valid && (
              <div className="flex gap-16 mt-8" style={{ fontSize: "0.88rem" }}>
                <span>Discount: <strong>Rs. {Number(testResult.calculatedDiscount).toLocaleString()}</strong></span>
                <span>Final Price: <strong style={{ color: "var(--navy)" }}>Rs. {Number(testResult.finalPrice).toLocaleString()}</strong></span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Campaigns List (CRUD Table) */}
      <h3 className="mt-24 mb-16">All Campaigns & Advertisements</h3>
      {loading ? (
        <div className="card card-pad center">Loading advertisements...</div>
      ) : promotions.length === 0 ? (
        <div className="card card-pad center">
          <p className="muted">No promotions or advertisements yet.</p>
          <button className="btn btn-primary mt-8" onClick={handleOpenCreate}>Create First Ad Campaign</button>
        </div>
      ) : (
        <div className="card" style={{ overflowX: "auto" }}>
          <table>
            <thead>
              <tr>
                <th>Ad Banner</th>
                <th>Campaign & Code</th>
                <th>Placement</th>
                <th>Concession / Discount</th>
                <th>Performance (Views / Clicks)</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {promotions.map((p) => {
                const ctr = p.impressionCount > 0 ? ((p.clickCount / p.impressionCount) * 100).toFixed(1) : "0.0";
                return (
                  <tr key={p.id}>
                    <td style={{ width: 120 }}>
                      <img
                        src={p.bannerImageUrl}
                        alt={p.title}
                        style={{ width: 110, height: 58, objectFit: "cover", borderRadius: 6, border: "1px solid #ddd" }}
                        onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400"; }}
                      />
                    </td>
                    <td>
                      <strong>{p.title}</strong>
                      <div style={{ marginTop: 2 }}>
                        <span style={{
                          background: "#fff3cd",
                          color: "#856404",
                          padding: "2px 6px",
                          borderRadius: 4,
                          fontWeight: 700,
                          fontSize: "0.8rem",
                          letterSpacing: "0.5px"
                        }}>
                          {p.promoCode}
                        </span>
                      </div>
                      <p className="muted" style={{ margin: "4px 0 0", fontSize: "0.78rem" }}>
                        {p.startDate} to {p.endDate}
                      </p>
                    </td>
                    <td>
                      <span className="badge badge-pending" style={{ fontSize: "0.75rem" }}>
                        {p.placement?.replace("_", " ")}
                      </span>
                    </td>
                    <td>
                      <strong>
                        {p.discountType === "PERCENTAGE" ? `${p.discountValue}% OFF` : `Rs. ${Number(p.discountValue).toLocaleString()} OFF`}
                      </strong>
                      <div className="muted" style={{ fontSize: "0.75rem" }}>Target: {p.targetPropertyType || "All"}</div>
                    </td>
                    <td>
                      <div><strong>{p.impressionCount?.toLocaleString()}</strong> views</div>
                      <div className="muted" style={{ fontSize: "0.8rem" }}>
                        <strong>{p.clickCount?.toLocaleString()}</strong> clicks &middot; {ctr}% CTR
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${p.status === "ACTIVE" ? "badge-available" : "badge-rejected"}`}>
                        {p.status}
                      </span>
                    </td>
                    <td>
                      <div className="flex gap-8" style={{ alignItems: "center" }}>
                        <button
                          className={p.status === "ACTIVE" ? "btn btn-outline btn-sm" : "btn btn-primary btn-sm"}
                          onClick={() => handleToggleStatus(p)}
                        >
                          {p.status === "ACTIVE" ? "Pause" : "Activate"}
                        </button>
                        <button className="btn btn-outline btn-sm" onClick={() => handleOpenEdit(p)}>
                          Edit
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p)}>
                          Delete
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

      {/* Create / Edit Modal Dialog */}
      {showModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
          padding: 16
        }}>
          <div className="card card-pad" style={{ width: "100%", maxWidth: 600, maxHeight: "90vh", overflowY: "auto", background: "white" }}>
            <div className="flex-between mb-16">
              <h2 style={{ margin: 0 }}>{editingPromo ? "Edit Ad Campaign" : "Create New Ad Campaign"}</h2>
              <button className="btn btn-outline btn-sm" onClick={() => setShowModal(false)}>✕</button>
            </div>

            <form onSubmit={handleSubmitForm}>
              <div className="field">
                <label>Campaign Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Grand Festive Property Concession"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="field-row">
                <div className="field">
                  <label>Promo Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. FESTIVE5"
                    value={formData.promoCode}
                    onChange={(e) => setFormData({ ...formData, promoCode: e.target.value.toUpperCase().trim() })}
                  />
                </div>
                <div className="field">
                  <label>Placement *</label>
                  <select
                    value={formData.placement}
                    onChange={(e) => setFormData({ ...formData, placement: e.target.value })}
                  >
                    <option value="HERO_BANNER">Hero Banner (Top of Home)</option>
                    <option value="SIDEBAR">Sidebar Banner</option>
                    <option value="FEATURED_LISTING">Featured Listing Badge</option>
                    <option value="POPUP">Notification Pop-up</option>
                  </select>
                </div>
              </div>

              <div className="field-row">
                <div className="field">
                  <label>Discount Type</label>
                  <select
                    value={formData.discountType}
                    onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                  >
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FIXED_AMOUNT">Fixed Concession (Rs.)</option>
                  </select>
                </div>
                <div className="field">
                  <label>Discount Value *</label>
                  <input
                    type="number"
                    required
                    step="any"
                    placeholder="e.g. 5 for 5% or 250000"
                    value={formData.discountValue}
                    onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                  />
                </div>
              </div>

              <div className="field">
                <label>Banner Image URL *</label>
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/..."
                  value={formData.bannerImageUrl}
                  onChange={(e) => setFormData({ ...formData, bannerImageUrl: e.target.value })}
                />
              </div>

              <div className="field-row">
                <div className="field">
                  <label>Start Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  />
                </div>
                <div className="field">
                  <label>End Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="field-row">
                <div className="field">
                  <label>Target Property Type</label>
                  <select
                    value={formData.targetPropertyType}
                    onChange={(e) => setFormData({ ...formData, targetPropertyType: e.target.value })}
                  >
                    <option value="All">All Types</option>
                    <option value="House">House</option>
                    <option value="Apartment">Apartment</option>
                    <option value="Land">Land</option>
                    <option value="Commercial">Commercial</option>
                  </select>
                </div>
                <div className="field">
                  <label>Target Click URL</label>
                  <input
                    type="text"
                    placeholder="e.g. /listings/1 or /"
                    value={formData.targetUrl}
                    onChange={(e) => setFormData({ ...formData, targetUrl: e.target.value })}
                  />
                </div>
              </div>

              <div className="field">
                <label>Campaign Description *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Explain the terms and eligibility of the promotion..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="flex gap-12 mt-16" style={{ justifyContent: "flex-end" }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingPromo ? "Save Changes" : "Create Campaign"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
