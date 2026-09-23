import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getPropertyById } from "../data/propertyApi";
import { getReviewsByProperty } from "../data/reviewApi";
import { validatePromoCode } from "../data/reportPromoApi";
import { bookAppointment } from "../data/appointmentApi";
import { createOffer } from "../data/offerApi";
import { useAuth } from "../context/AuthContext";
import StarRating from "../components/StarRating";

function formatCurrency(value) {
  return new Intl.NumberFormat("en-LK", {
    style: "currency", currency: "LKR", maximumFractionDigits: 0
  }).format(Number(value) || 0);
}

function formatStatus(status) {
  return status ? status.toLowerCase().replaceAll("_", " ").replace(/\b\w/g, (c) => c.toUpperCase()) : "Unknown";
}

function getImages(property) {
  const images = [];
  if (property?.imageUrl) images.push(property.imageUrl);
  property?.images?.forEach((item) => {
    const url = item.imageUrl || item.url;
    if (url && !images.includes(url)) images.push(url);
  });
  return images;
}

export default function ListingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [property, setProperty] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");

  // Promo code verification state (Shavindi T.D.P.)
  const [promoCode, setPromoCode] = useState("");
  const [promoResult, setPromoResult] = useState(null);
  const [checkingPromo, setCheckingPromo] = useState(false);

  // Appointment Modal state (Randil B.R.K.)
  const [showApptModal, setShowApptModal] = useState(false);
  const [apptForm, setApptForm] = useState({
    date: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
    time: "10:00 AM",
    notes: ""
  });
  const [bookingAppt, setBookingAppt] = useState(false);

  // Offer Modal state (Halangoda R.W.W.M.M.C.)
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [offerAmount, setOfferAmount] = useState("");
  const [offerMessage, setOfferMessage] = useState("");
  const [submittingOffer, setSubmittingOffer] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError("");
        const result = await getPropertyById(id);
        setProperty(result);
        setSelectedImage(getImages(result)[0] ?? "");
        setOfferAmount(result.price ? String(result.price) : "");

        const reviewList = await getReviewsByProperty(id).catch(() => []);
        setReviews(reviewList || []);
      } catch (requestError) {
        setError(requestError.message);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  async function handleApplyPromo(e) {
    e.preventDefault();
    if (!promoCode.trim()) return;
    try {
      setCheckingPromo(true);
      const res = await validatePromoCode(promoCode.trim(), property?.price);
      setPromoResult(res);
    } catch (err) {
      setPromoResult({ valid: false, message: err.message });
    } finally {
      setCheckingPromo(false);
    }
  }

  async function handleBookAppointment(e) {
    e.preventDefault();
    if (!user) {
      navigate("/login");
      return;
    }
    try {
      setBookingAppt(true);
      await bookAppointment({
        propertyId: property.id,
        propertyTitle: property.title,
        buyerId: user.databaseId || user.id || 3,
        buyerName: user.name,
        buyerPhone: user.phone || "077 123 4567",
        buyerEmail: user.email,
        agentId: 5,
        appointmentDate: apptForm.date,
        appointmentTime: apptForm.time,
        notes: apptForm.notes
      });
      setShowApptModal(false);
      setFeedback("Viewing appointment requested successfully! View under Appointments.");
    } catch (err) {
      setFeedback("Failed to book appointment: " + err.message);
    } finally {
      setBookingAppt(false);
    }
  }

  async function handleMakeOffer(e) {
    e.preventDefault();
    if (!user) {
      navigate("/login");
      return;
    }
    try {
      setSubmittingOffer(true);
      await createOffer({
        propertyId: property.id,
        propertyTitle: property.title,
        buyerId: user.databaseId || user.id || 3,
        buyerName: user.name,
        sellerId: property.sellerId || 4,
        offerAmount: Number(offerAmount),
        message: offerMessage
      });
      setShowOfferModal(false);
      setFeedback("Your purchase offer was submitted to the seller! View under Offers.");
    } catch (err) {
      setFeedback("Failed to submit offer: " + err.message);
    } finally {
      setSubmittingOffer(false);
    }
  }

  if (loading) return <div className="container page"><div className="card card-pad center">Loading property details...</div></div>;

  if (error || !property) {
    return (
      <div className="container page" style={{ maxWidth: 600 }}>
        <div className="card card-pad center">
          <h2>Property could not be loaded</h2>
          <p style={{ color: "var(--danger)" }}>{error || "Property was not found."}</p>
          <button className="btn btn-primary" onClick={() => navigate("/")}>Back to Properties</button>
        </div>
      </div>
    );
  }

  const images = getImages(property);

  return (
    <div className="container page" style={{ maxWidth: 1000 }}>
      <div className="flex-between mb-16">
        <Link to="/" className="btn btn-outline btn-sm">&larr; Back to Browse</Link>
        {user && (user.role === "SELLER" || user.role === "AGENT" || user.role === "ADMIN") && (
          <Link to={`/my-listings/${property.id}/edit`} className="btn btn-outline btn-sm">Edit Listing</Link>
        )}
      </div>

      {feedback && (
        <div style={{ padding: "12px 16px", marginBottom: 16, background: "#d1e7dd", color: "#0f5132", borderRadius: 8, fontWeight: 500 }}>
          {feedback}
        </div>
      )}

      <div className="card" style={{ overflow: "hidden" }}>
        {selectedImage ? (
          <img src={selectedImage} alt={property.title}
            style={{ width: "100%", height: 420, objectFit: "cover", display: "block" }} />
        ) : (
          <div style={{ height: 300, display: "grid", placeItems: "center", background: "#e9efec" }}>No property image available</div>
        )}

        {images.length > 1 && (
          <div className="flex gap-8" style={{ padding: 12, overflowX: "auto", borderBottom: "1px solid #eee" }}>
            {images.map((image) => (
              <button key={image} type="button" onClick={() => setSelectedImage(image)} style={{ padding: 0, cursor: "pointer", border: selectedImage === image ? "2px solid var(--gold)" : "1px solid #ddd", borderRadius: 4 }}>
                <img src={image} alt="Property thumbnail" style={{ width: 90, height: 65, objectFit: "cover", display: "block" }} />
              </button>
            ))}
          </div>
        )}

        <div className="card-pad">
          <div className="flex-between" style={{ alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
            <div>
              <h1 style={{ margin: "0 0 6px" }}>{property.title}</h1>
              <p className="muted" style={{ margin: 0 }}>{property.location}, {property.city}</p>
            </div>
            <div className="flex gap-8" style={{ alignItems: "center" }}>
              <span className="badge badge-available">{formatStatus(property.status)}</span>
              {user && (user.role === "BUYER" || !user.role) && (
                <>
                  <button className="btn btn-outline btn-sm" onClick={() => setShowApptModal(true)}>
                    📅 Book Viewing
                  </button>
                  <button className="btn btn-primary btn-sm" onClick={() => setShowOfferModal(true)}>
                    💰 Make an Offer
                  </button>
                </>
              )}
            </div>
          </div>

          <h2 style={{ color: "var(--navy)", margin: "16px 0 0" }}>{formatCurrency(property.price)}</h2>

          {/* Promo code discount box (Shavindi T.D.P.) */}
          <div style={{ marginTop: 16, padding: "12px 16px", background: "#fcf8ee", border: "1px solid #ecdca8", borderRadius: 8 }}>
            <div className="flex-between" style={{ flexWrap: "wrap", gap: 8, alignItems: "center" }}>
              <div>
                <strong>Have a promotion code?</strong>
                <span className="muted" style={{ marginLeft: 8, fontSize: "0.85rem" }}>
                  Try <code>FESTIVE5</code> or <code>LUXURY250K</code>
                </span>
              </div>
              <form onSubmit={handleApplyPromo} className="flex gap-8" style={{ alignItems: "center" }}>
                <input
                  type="text"
                  placeholder="Promo Code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid #ccc", fontSize: "0.85rem", width: 140 }}
                />
                <button type="submit" className="btn btn-gold btn-sm" disabled={checkingPromo}>
                  {checkingPromo ? "Checking..." : "Apply"}
                </button>
              </form>
            </div>

            {promoResult && (
              <div style={{ marginTop: 8, fontSize: "0.88rem", color: promoResult.valid ? "#2e7d32" : "#c62828" }}>
                {promoResult.message}
                {promoResult.valid && (
                  <div style={{ marginTop: 4, fontWeight: 700 }}>
                    Discount: -Rs. {Number(promoResult.calculatedDiscount).toLocaleString()} | Net Price: {formatCurrency(promoResult.finalPrice)}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="field-row mt-24">
            <div className="card card-pad center"><strong>{property.propertyType}</strong><span className="muted" style={{ fontSize: "0.8rem" }}>Type</span></div>
            <div className="card card-pad center"><strong>{property.bedrooms || 0}</strong><span className="muted" style={{ fontSize: "0.8rem" }}>Bedrooms</span></div>
            <div className="card card-pad center"><strong>{property.bathrooms || 0}</strong><span className="muted" style={{ fontSize: "0.8rem" }}>Bathrooms</span></div>
            <div className="card card-pad center"><strong>{property.area || 0}</strong><span className="muted" style={{ fontSize: "0.8rem" }}>Sq. Ft</span></div>
          </div>

          <div style={{ marginTop: 24 }}>
            <h3>About this property</h3>
            <p style={{ lineHeight: 1.7, color: "#444" }}>{property.description}</p>
          </div>

          {/* Reviews & Ratings Section (Heshan I. A. M) */}
          <div style={{ marginTop: 32, borderTop: "1px solid #eee", paddingTop: 24 }}>
            <div className="flex-between mb-16">
              <h3>Buyer Reviews & Ratings</h3>
              <Link to="/reviews" className="btn btn-outline btn-sm">Submit Review</Link>
            </div>

            {reviews.length === 0 ? (
              <p className="muted">No reviews yet for this listing. Verified buyers can submit feedback after purchase.</p>
            ) : (
              <div className="flex" style={{ flexDirection: "column", gap: 12 }}>
                {reviews.map((r) => (
                  <div key={r.id} className="card card-pad" style={{ background: "#fafafa" }}>
                    <div className="flex-between">
                      <strong>{r.buyerName}</strong>
                      <StarRating rating={r.rating} />
                    </div>
                    <p style={{ margin: "6px 0 0", color: "#333" }}>&ldquo;{r.comment}&rdquo;</p>
                    {r.response && (
                      <div style={{ marginTop: 8, padding: 8, background: "#fff", borderLeft: "3px solid var(--gold)", fontSize: "0.85rem" }}>
                        <strong>Agent Response:</strong> {r.response}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Book Appointment Modal (Randil B.R.K.) */}
      {showApptModal && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 9999, padding: 16
        }}>
          <div className="card card-pad" style={{ width: "100%", maxWidth: 460, background: "white" }}>
            <div className="flex-between mb-16">
              <h2 style={{ margin: 0 }}>Request Property Viewing</h2>
              <button className="btn btn-outline btn-sm" onClick={() => setShowApptModal(false)}>✕</button>
            </div>

            <form onSubmit={handleBookAppointment}>
              <div className="field">
                <label>Preferred Date *</label>
                <input
                  type="date"
                  required
                  value={apptForm.date}
                  onChange={(e) => setApptForm({ ...apptForm, date: e.target.value })}
                />
              </div>

              <div className="field">
                <label>Preferred Time Slot *</label>
                <select
                  value={apptForm.time}
                  onChange={(e) => setApptForm({ ...apptForm, time: e.target.value })}
                >
                  <option value="10:00 AM">10:00 AM - Morning</option>
                  <option value="11:30 AM">11:30 AM - Morning</option>
                  <option value="02:00 PM">02:00 PM - Afternoon</option>
                  <option value="03:30 PM">03:30 PM - Afternoon</option>
                  <option value="05:00 PM">05:00 PM - Evening</option>
                </select>
              </div>

              <div className="field">
                <label>Notes for the Agent</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Bringing family members, want to inspect boundary..."
                  value={apptForm.notes}
                  onChange={(e) => setApptForm({ ...apptForm, notes: e.target.value })}
                />
              </div>

              <div className="flex gap-12 mt-16" style={{ justifyContent: "flex-end" }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowApptModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={bookingAppt}>
                  {bookingAppt ? "Scheduling\u2026" : "Confirm Booking"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Make an Offer Modal (Halangoda R.W.W.M.M.C.) */}
      {showOfferModal && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 9999, padding: 16
        }}>
          <div className="card card-pad" style={{ width: "100%", maxWidth: 460, background: "white" }}>
            <div className="flex-between mb-16">
              <h2 style={{ margin: 0 }}>Make a Purchase Offer</h2>
              <button className="btn btn-outline btn-sm" onClick={() => setShowOfferModal(false)}>✕</button>
            </div>

            <form onSubmit={handleMakeOffer}>
              <div className="field">
                <label>Listing Price: <strong>{formatCurrency(property.price)}</strong></label>
              </div>

              <div className="field">
                <label>Your Offer Amount (LKR) *</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 40000000"
                  value={offerAmount}
                  onChange={(e) => setOfferAmount(e.target.value)}
                />
              </div>

              <div className="field">
                <label>Message / Terms for Seller</label>
                <textarea
                  rows={3}
                  placeholder="e.g. Subject to immediate 10% cash deposit and loan pre-approval..."
                  value={offerMessage}
                  onChange={(e) => setOfferMessage(e.target.value)}
                />
              </div>

              <div className="flex gap-12 mt-16" style={{ justifyContent: "flex-end" }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowOfferModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={submittingOffer}>
                  {submittingOffer ? "Submitting\u2026" : "Submit Offer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
