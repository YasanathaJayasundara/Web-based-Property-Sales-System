import React, { useEffect, useState } from "react";
import {
  getAllReviews,
  getReviewsByBuyer,
  createReview,
  respondToReview,
  deleteReview,
  getUserNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification
} from "../data/reviewApi";
import { getAllProperties } from "../data/propertyApi";
import { useAuth } from "../context/AuthContext";
import StarRating from "../components/StarRating";
import { REVIEWS, NOTIFICATIONS } from "../data/mockData";

export default function Reviews() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("reviews"); // reviews | notifications

  // Reviews State
  const [reviews, setReviews] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Create Review Form State
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [selectedPropertyId, setSelectedPropertyId] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Agent Reply State
  const [replyingId, setReplyingId] = useState(null);
  const [replyText, setReplyText] = useState("");

  // Notifications State
  const [notifications, setNotifications] = useState([]);

  async function loadData() {
    try {
      setLoading(true);
      setError("");
      const uid = user?.databaseId || user?.id || 3;

      const [reviewsList, notifsList, propsList] = await Promise.all([
        getAllReviews().catch(() => []),
        getUserNotifications(uid).catch(() => []),
        getAllProperties().catch(() => [])
      ]);

      if (reviewsList && reviewsList.length > 0) {
        setReviews(reviewsList);
      } else {
        setReviews(REVIEWS.map(r => ({
          ...r,
          id: r.id.replace("r", ""),
          buyerName: "Amara Fernando",
          createdAt: r.createdAt || "2026-08-22"
        })));
      }

      if (notifsList && notifsList.length > 0) {
        setNotifications(notifsList);
      } else {
        setNotifications(NOTIFICATIONS.map(n => ({
          ...n,
          id: n.id.replace("n", ""),
          title: n.type || "Platform Alert",
          createdAt: n.createdAt || "2026-09-01T08:00:00"
        })));
      }

      setProperties(propsList || []);
      if (propsList && propsList.length > 0) {
        setSelectedPropertyId(propsList[0].id);
      }
    } catch (err) {
      setError(err.message || "Failed to load reviews and notifications");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [user]);

  async function handleCreateReview(e) {
    e.preventDefault();
    if (!comment.trim()) {
      setError("Please write a review comment.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      setSuccess("");

      const created = await createReview({
        propertyId: selectedPropertyId ? Number(selectedPropertyId) : 1,
        buyerId: user?.databaseId || user?.id || 3,
        buyerName: user?.name || "Amara Fernando",
        agentId: 5,
        rating: Number(rating),
        comment: comment.trim()
      });

      setReviews((prev) => [created, ...prev]);
      setSuccess("Thank you! Your review was posted and the agent has been notified.");
      setComment("");
      setRating(5);
    } catch (err) {
      setError(err.message || "Failed to post review");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSendReply(reviewId) {
    if (!replyText.trim()) return;
    try {
      setError("");
      setSuccess("");
      const updated = await respondToReview(reviewId, replyText.trim());
      setReviews((prev) => prev.map((r) => (r.id === reviewId ? updated : r)));
      setSuccess("Your reply was sent to the buyer!");
      setReplyingId(null);
      setReplyText("");
    } catch (err) {
      setError(err.message || "Failed to reply to review");
    }
  }

  async function handleDeleteReview(id) {
    if (!window.confirm("Remove this review? This cannot be undone.")) return;
    try {
      setError("");
      setSuccess("");
      await deleteReview(id);
      setReviews((prev) => prev.filter((r) => r.id !== id));
      setSuccess("Review removed.");
    } catch (err) {
      setError(err.message || "Failed to delete review");
    }
  }

  async function handleMarkRead(notifId) {
    try {
      const updated = await markNotificationRead(notifId);
      setNotifications((prev) => prev.map((n) => (n.id === notifId ? updated : n)));
    } catch (err) {
      console.warn("Failed to mark read:", err);
    }
  }

  async function handleMarkAllRead() {
    try {
      const uid = user?.databaseId || user?.id || 3;
      await markAllNotificationsRead(uid);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      console.warn("Failed to mark all read:", err);
    }
  }

  async function handleDeleteNotif(notifId) {
    try {
      await deleteNotification(notifId);
      setNotifications((prev) => prev.filter((n) => n.id !== notifId));
    } catch (err) {
      console.warn("Failed to delete notification:", err);
    }
  }

  return (
    <div className="container page">
      <div className="flex-between" style={{ alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
        <div>
          <span className="badge badge-accepted" style={{ marginBottom: 6, display: "inline-block" }}>
            Module 2 &middot; Heshan I. A. M (IT25102034)
          </span>
          <h1 style={{ margin: "4px 0" }}>Reviews, Ratings & Notifications</h1>
          <p className="muted" style={{ margin: 0 }}>
            Share verified buyer ratings and feedback, enable agent replies, and monitor real-time system alerts.
          </p>
        </div>

        <div className="flex gap-8">
          <button
            className={activeTab === "reviews" ? "btn btn-primary btn-sm" : "btn btn-outline btn-sm"}
            onClick={() => setActiveTab("reviews")}
          >
            Reviews & Ratings ({reviews.length})
          </button>
          <button
            className={activeTab === "notifications" ? "btn btn-primary btn-sm" : "btn btn-outline btn-sm"}
            onClick={() => setActiveTab("notifications")}
          >
            Notifications ({notifications.filter(n => !n.isRead).length} new)
          </button>
        </div>
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

      {/* REVIEWS TAB */}
      {activeTab === "reviews" && (
        <div className="grid mt-24" style={{ gridTemplateColumns: "1.2fr 0.8fr", gap: 24, alignItems: "flex-start" }}>
          {/* Reviews List */}
          <div>
            <h3 style={{ margin: "0 0 16px" }}>Buyer Testimonials & Agent Ratings</h3>
            {loading ? (
              <div className="card card-pad center">Loading reviews...</div>
            ) : reviews.length === 0 ? (
              <div className="card card-pad center">No reviews yet. Be the first to share your experience!</div>
            ) : (
              <div className="flex" style={{ flexDirection: "column", gap: 14 }}>
                {reviews.map((r) => {
                  const isReplying = replyingId === r.id;
                  return (
                    <div key={r.id} className="card card-pad">
                      <div className="flex-between">
                        <div>
                          <strong>{r.buyerName}</strong>
                          <span className="muted" style={{ marginLeft: 8, fontSize: "0.82rem" }}>
                            {r.createdAt ? r.createdAt.slice(0, 10) : "2026-08-22"}
                          </span>
                        </div>
                        <StarRating rating={r.rating} />
                      </div>

                      <p style={{ margin: "8px 0 0", color: "#333", lineHeight: 1.6 }}>
                        &ldquo;{r.comment}&rdquo;
                      </p>

                      {/* Agent Response View */}
                      {r.response && (
                        <div style={{
                          marginTop: 12,
                          padding: "10px 12px",
                          background: "#fcf8ee",
                          borderLeft: "3px solid var(--gold)",
                          borderRadius: 4,
                          fontSize: "0.88rem"
                        }}>
                          <strong style={{ color: "var(--navy)" }}>Agent Response:</strong> {r.response}
                        </div>
                      )}

                      <div className="flex gap-8 mt-12" style={{ justifyContent: "flex-end" }}>
                        {(user?.role === "AGENT" || user?.role === "ADMIN") && !r.response && (
                          <button
                            className="btn btn-outline btn-sm"
                            onClick={() => {
                              setReplyingId(isReplying ? null : r.id);
                              setReplyText("");
                            }}
                          >
                            Reply to Buyer
                          </button>
                        )}
                        <button className="btn btn-danger btn-sm" onClick={() => handleDeleteReview(r.id)}>
                          Delete
                        </button>
                      </div>

                      {/* Agent Reply Box */}
                      {isReplying && (
                        <div style={{ marginTop: 12, padding: 12, background: "#f8f9fa", borderRadius: 6 }}>
                          <textarea
                            rows={2}
                            placeholder="Write your professional response to this buyer..."
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            style={{ width: "100%", padding: 8, borderRadius: 4, border: "1px solid #ccc" }}
                          />
                          <div className="flex gap-8 mt-8" style={{ justifyContent: "flex-end" }}>
                            <button className="btn btn-outline btn-sm" onClick={() => setReplyingId(null)}>Cancel</button>
                            <button className="btn btn-primary btn-sm" onClick={() => handleSendReply(r.id)}>Post Reply</button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Submit Review Card */}
          <div className="card card-pad">
            <h3 style={{ margin: "0 0 12px" }}>Write a Review</h3>
            <p className="muted" style={{ margin: "0 0 16px", fontSize: "0.88rem" }}>
              Rate your property viewing, purchase negotiation, or agent support.
            </p>

            <form onSubmit={handleCreateReview}>
              <div className="field">
                <label>Select Property (Optional)</label>
                <select
                  value={selectedPropertyId}
                  onChange={(e) => setSelectedPropertyId(e.target.value)}
                >
                  {properties.map((p) => (
                    <option key={p.id} value={p.id}>{p.title}</option>
                  ))}
                </select>
              </div>

              <div className="field">
                <label>Rating (1 to 5 Stars) *</label>
                <div className="flex gap-8" style={{ alignItems: "center", margin: "6px 0" }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      style={{
                        background: "none",
                        border: "none",
                        fontSize: "1.6rem",
                        cursor: "pointer",
                        color: star <= rating ? "var(--gold)" : "#ddd"
                      }}
                    >
                      ★
                    </button>
                  ))}
                  <span style={{ fontWeight: 600, marginLeft: 8 }}>{rating} Stars</span>
                </div>
              </div>

              <div className="field">
                <label>Your Feedback / Comment *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Share details about the property condition, accuracy of listing, and responsiveness..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </div>

              <button type="submit" className="btn btn-primary btn-block mt-16" disabled={submitting}>
                {submitting ? "Posting\u2026" : "Submit Review"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* NOTIFICATIONS TAB */}
      {activeTab === "notifications" && (
        <div className="card card-pad mt-24" style={{ maxWidth: 760, margin: "24px auto 0" }}>
          <div className="flex-between mb-16">
            <h3 style={{ margin: 0 }}>System Notifications & Activity Alerts</h3>
            {notifications.some(n => !n.isRead) && (
              <button className="btn btn-outline btn-sm" onClick={handleMarkAllRead}>
                Mark All as Read
              </button>
            )}
          </div>

          {notifications.length === 0 ? (
            <p className="muted center" style={{ padding: 24 }}>No notifications at this time.</p>
          ) : (
            <div className="flex" style={{ flexDirection: "column", gap: 10 }}>
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className="flex-between"
                  style={{
                    padding: 12,
                    borderRadius: 6,
                    background: n.isRead ? "#fbfbfb" : "#edf4f8",
                    borderLeft: `4px solid ${n.isRead ? "#ccc" : "var(--navy)"}`
                  }}
                >
                  <div>
                    <strong>{n.title}</strong>
                    <p style={{ margin: "2px 0 0", fontSize: "0.88rem", color: "#444" }}>{n.message}</p>
                    <span className="muted" style={{ fontSize: "0.75rem" }}>
                      {n.createdAt ? new Date(n.createdAt).toLocaleString("en-GB") : "Recently"}
                    </span>
                  </div>

                  <div className="flex gap-8" style={{ alignItems: "center" }}>
                    {!n.isRead && (
                      <button className="btn btn-primary btn-sm" onClick={() => handleMarkRead(n.id)}>
                        Mark Read
                      </button>
                    )}
                    <button className="btn btn-outline btn-sm" onClick={() => handleDeleteNotif(n.id)}>
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
