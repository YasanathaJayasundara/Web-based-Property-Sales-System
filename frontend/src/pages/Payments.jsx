import React, { useState } from "react";
import { Link } from "react-router-dom";
import { OFFERS, PAYMENTS, findListing, currency } from "../data/mockData";
import { useAuth } from "../context/AuthContext";

export default function Payments() {
  const { user } = useAuth();
  const [payments, setPayments] = useState(PAYMENTS);
  const [processing, setProcessing] = useState(null);
  const [failedOnce, setFailedOnce] = useState({});

  const acceptedUnpaid = OFFERS.filter(
    (o) => o.buyerId === user.id && o.status === "Accepted" && !payments.some((p) => p.offerId === o.id)
  );
  const myPayments = payments.filter((p) => p.buyerId === user.id);

  function handlePay(offer) {
    setProcessing(offer.id);
    setTimeout(() => {
      // Simulate an occasional gateway failure on the first attempt, per the use case's alternative flow.
      if (!failedOnce[offer.id]) {
        setFailedOnce((f) => ({ ...f, [offer.id]: true }));
        setProcessing(null);
        alert("Payment could not be processed by the sandbox gateway. Please try again.");
        return;
      }
      const deposit = Math.round(offer.amount * 0.1);
      setPayments((prev) => [
        ...prev,
        { id: "p" + Date.now(), offerId: offer.id, buyerId: user.id, amount: deposit, status: "Completed", createdAt: new Date().toISOString(), receiptId: "RCPT-" + Math.floor(1000 + Math.random() * 9000) },
      ]);
      setProcessing(null);
    }, 900);
  }

  return (
    <div className="container page">
      <h1>Payments</h1>
      <p className="muted">Pay the deposit on an accepted offer, and view your past transactions.</p>

      {acceptedUnpaid.length > 0 && (
        <div className="mt-24">
          <h2 style={{ fontSize: "1.1rem" }}>Awaiting payment</h2>
          <div className="flex" style={{ flexDirection: "column", gap: 12 }}>
            {acceptedUnpaid.map((o) => {
              const listing = findListing(o.listingId);
              const deposit = Math.round(o.amount * 0.1);
              return (
                <div key={o.id} className="card card-pad flex-between">
                  <div>
                    <strong>{listing.title}</strong>
                    <p className="muted" style={{ margin: "2px 0" }}>Deposit due (10%): {currency(deposit)}</p>
                  </div>
                  <button className="btn btn-gold" disabled={processing === o.id} onClick={() => handlePay(o)}>
                    {processing === o.id ? "Processing\u2026" : "Pay deposit"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="mt-32">
        <h2 style={{ fontSize: "1.1rem" }}>Payment history</h2>
        {myPayments.length === 0 ? (
          <div className="empty-state card card-pad">
            <h3>No payments yet</h3>
            <p>Completed payments and digital receipts will appear here.</p>
          </div>
        ) : (
          <div className="card" style={{ overflow: "hidden" }}>
            <table>
              <thead>
                <tr><th>Property</th><th>Amount</th><th>Date</th><th>Receipt</th><th>Status</th></tr>
              </thead>
              <tbody>
                {myPayments.map((p) => {
                  const offer = OFFERS.find((o) => o.id === p.offerId);
                  const listing = offer ? findListing(offer.listingId) : null;
                  return (
                    <tr key={p.id}>
                      <td>{listing ? <Link to={`/listings/${listing.id}`} style={{ textDecoration: "none" }}>{listing.title}</Link> : "\u2014"}</td>
                      <td>{currency(p.amount)}</td>
                      <td className="muted">{new Date(p.createdAt).toLocaleDateString("en-GB")}</td>
                      <td className="muted">{p.receiptId}</td>
                      <td><span className="badge badge-accepted">{p.status}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
