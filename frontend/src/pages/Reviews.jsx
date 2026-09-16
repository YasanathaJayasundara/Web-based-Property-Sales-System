import React, { useState } from "react";
import { Link } from "react-router-dom";
import { REVIEWS, PAYMENTS, OFFERS, findListing } from "../data/mockData";
import { useAuth } from "../context/AuthContext";
import StarRating from "../components/StarRating";

export default function Reviews() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState(REVIEWS);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [selectedPayment, setSelectedPayment] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const completedTransactions = PAYMENTS.filter((p) => p.buyerId === user.id);
  const myReviews = reviews.filter((r) => r.buyerId === user.id);
  const reviewedPaymentIds = new Set(myReviews.map((r) => r.paymentId));

  function handleSubmit(e) {
    e.preventDefault();
    if (!selectedPayment) {
      setError("Please select which purchase you're reviewing.");
      return;
    }
    if (reviewedPaymentIds.has(selectedPayment)) {
      setError("You've already submitted a review for this transaction.");
      return;
    }
    if (rating === 0) {
      setError("Please choose a star rating.");
      return;
    }
    const payment = completedTransactions.find((p) => p.id === selectedPayment);
    const offer = payment ? OFFERS.find((o) => o.id === payment.offerId) : null;
    const listing = offer ? findListing(offer.listingId) : null;

    setReviews((prev) => [
      ...prev,
      {
        id: "r" + Date.now(),
        listingId: listing?.id,
        agentId: listing?.agentId,
        buyerId: user.id,
        paymentId: selectedPayment,
        rating,
        comment,
        response: "",
        status: "Published",
        createdAt: new Date().toISOString().slice(0, 10),
      },
    ]);
    // «extend» Receive Notification is sent to the agent/seller here in the real backend.
    setNotice("Thank you \u2014 your review has been posted, and the agent has been notified.");
    setRating(0);
    setComment("");
    setSelectedPayment("");
    setError("");
  }

  return (
    <div className="container page">
      <h1>Reviews</h1>
      <p className="muted">Leave a review for a completed purchase, and see reviews you've written.</p>

      {completedTransactions.length > 0 && (
        <div className="card card-pad mt-24" style={{ maxWidth: 520 }}>
          <h3 style={{ fontSize: "1rem" }}>Write a review</h3>
          <form onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="txn">Which purchase?</label>
              <select id="txn" value={selectedPayment} onChange={(e) => { setSelectedPayment(e.target.value); setError(""); }}>
                <option value="">Select a completed transaction</option>
                {completedTransactions.map((p) => (
                  <option key={p.id} value={p.id} disabled={reviewedPaymentIds.has(p.id)}>
                    {p.receiptId} {reviewedPaymentIds.has(p.id) ? "(already reviewed)" : ""}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>Rating</label>
              <StarRating value={rating} onChange={setRating} size="1.4rem" />
            </div>
            <div className="field">
              <label htmlFor="comment">Comment</label>
              <textarea id="comment" rows={4} value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Share your experience with the agent and the property" />
            </div>
            {error && <p style={{ color: "var(--danger)", fontSize: "0.88rem" }}>{error}</p>}
            {notice && <p style={{ color: "var(--sage)", fontSize: "0.88rem" }}>{notice}</p>}
            <button type="submit" className="btn btn-primary btn-block">Submit review</button>
          </form>
        </div>
      )}

      <div className="mt-32">
        <h2 style={{ fontSize: "1.1rem" }}>Your reviews</h2>
        {myReviews.length === 0 ? (
          <div className="empty-state card card-pad">
            <h3>No reviews yet</h3>
            <p>Once you complete a purchase, you can leave a review here.</p>
          </div>
        ) : (
          <div className="flex" style={{ flexDirection: "column", gap: 12 }}>
            {myReviews.map((r) => {
              const listing = findListing(r.listingId);
              return (
                <div key={r.id} className="card card-pad">
                  <div className="flex-between">
                    {listing ? <Link to={`/listings/${listing.id}`} style={{ fontWeight: 600, textDecoration: "none" }}>{listing.title}</Link> : <span className="muted">Listing removed</span>}
                    <StarRating value={r.rating} />
                  </div>
                  <p className="mt-8" style={{ marginBottom: r.response ? 12 : 0 }}>{r.comment}</p>
                  {r.response && (
                    <div style={{ background: "var(--cream)", borderRadius: 8, padding: "10px 14px", fontSize: "0.9rem" }}>
                      <strong style={{ color: "var(--navy)" }}>Agent response: </strong>{r.response}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
