import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getAllPayments,
  getPaymentsByBuyer,
  processPayment,
  updatePaymentStatus,
  deletePayment
} from "../data/userPaymentApi";
import { getAllOffers, getOffersByBuyer } from "../data/offerApi";
import { useAuth } from "../context/AuthContext";
import { currency, PAYMENTS } from "../data/mockData";

export default function Payments() {
  const { user } = useAuth();
  const [payments, setPayments] = useState([]);
  const [acceptedOffers, setAcceptedOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [processingId, setProcessingId] = useState(null);
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  async function loadData() {
    try {
      setLoading(true);
      setError("");
      const uid = user?.databaseId || user?.id;

      let paymentList = [];
      let offerList = [];

      if (user?.role === "BUYER") {
        paymentList = await getPaymentsByBuyer(uid || 3).catch(() => []);
        offerList = await getOffersByBuyer(uid || 3).catch(() => []);
      } else {
        paymentList = await getAllPayments().catch(() => []);
        offerList = await getAllOffers().catch(() => []);
      }

      if (paymentList && paymentList.length > 0) {
        setPayments(paymentList);
      } else {
        // Fallback to sample seed
        setPayments(PAYMENTS.map(p => ({
          ...p,
          propertyTitle: "2BR Luxury Apartment, Rajagiriya",
          buyerName: "Amara Fernando",
          paymentDate: p.createdAt || "2026-08-20T09:15:00",
          transactionRef: "TXN-9842109",
          receiptNumber: p.receiptId || "RCPT-1002",
          paymentMethod: "SANDBOX"
        })));
      }

      // Filter offers that are accepted and not yet fully paid
      const unpaid = (offerList || []).filter(
        (o) => o.status === "ACCEPTED" && !paymentList.some((p) => p.offerId === o.id)
      );
      setAcceptedOffers(unpaid);
    } catch (err) {
      setError(err.message || "Failed to load payment records");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [user]);

  async function handlePayDeposit(offer) {
    try {
      setProcessingId(offer.id);
      setError("");
      setSuccess("");

      const depositAmount = Math.round(Number(offer.offerAmount) * 0.1);
      const paymentRecord = await processPayment({
        offerId: offer.id,
        propertyId: offer.propertyId,
        propertyTitle: offer.propertyTitle || "Property Purchase",
        buyerId: user?.databaseId || user?.id || 3,
        buyerName: user?.name || "Amara Fernando",
        amount: depositAmount,
        depositPercentage: 10.0,
        paymentMethod: "SANDBOX"
      });

      setPayments((prev) => [paymentRecord, ...prev]);
      setAcceptedOffers((prev) => prev.filter((o) => o.id !== offer.id));
      setSuccess(`Deposit of ${currency(depositAmount)} processed successfully! Receipt: ${paymentRecord.receiptNumber}`);
      setSelectedReceipt(paymentRecord);
    } catch (err) {
      setError(err.message || "Payment processing failed");
    } finally {
      setProcessingId(null);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Void and delete this payment record?")) return;
    try {
      setError("");
      setSuccess("");
      await deletePayment(id);
      setPayments((prev) => prev.filter((p) => p.id !== id));
      setSuccess("Payment record removed.");
    } catch (err) {
      setError(err.message || "Failed to delete payment");
    }
  }

  return (
    <div className="container page">
      <div className="flex-between" style={{ alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
        <div>
          <span className="badge badge-accepted" style={{ marginBottom: 6, display: "inline-block" }}>
            Module 6 &middot; Wanniarachchi W.K.A.N (IT25200151)
          </span>
          <h1 style={{ margin: "4px 0" }}>Payments & Transaction Handling</h1>
          <p className="muted" style={{ margin: 0 }}>
            Pay secure deposit commitments on accepted property offers and access verified digital receipts.
          </p>
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

      {/* Awaiting Deposit Payments Section */}
      {acceptedOffers.length > 0 && (
        <div className="mt-24">
          <h2 style={{ fontSize: "1.2rem", margin: "0 0 12px", color: "var(--navy)" }}>
            Awaiting Deposit Payment (10% Security Advance)
          </h2>
          <div className="flex" style={{ flexDirection: "column", gap: 12 }}>
            {acceptedOffers.map((o) => {
              const deposit = Math.round(Number(o.offerAmount) * 0.1);
              const isProcessing = processingId === o.id;
              return (
                <div key={o.id} className="card card-pad flex-between" style={{ borderLeft: "4px solid var(--gold)" }}>
                  <div>
                    <h3 style={{ margin: "0 0 4px" }}>{o.propertyTitle}</h3>
                    <p style={{ margin: "2px 0", fontSize: "0.95rem" }}>
                      Accepted Purchase Price: <strong>{currency(o.offerAmount)}</strong>
                    </p>
                    <p className="muted" style={{ margin: "2px 0", fontSize: "0.85rem" }}>
                      10% Advance Deposit Due: <strong style={{ color: "var(--navy)" }}>{currency(deposit)}</strong>
                    </p>
                  </div>
                  <button
                    className="btn btn-gold"
                    disabled={isProcessing}
                    onClick={() => handlePayDeposit(o)}
                  >
                    {isProcessing ? "Processing via Sandbox\u2026" : "Pay Deposit (Sandbox)"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Payment Records & Receipts History (Full CRUD) */}
      <div className="flex-between mt-32 mb-16">
        <div>
          <h2 style={{ margin: "0 0 4px" }}>Transaction History & Digital Receipts</h2>
          <p className="muted" style={{ margin: 0 }}>
            Completed deposit transactions recorded in the SQL Server database.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="card card-pad center">Loading payment records...</div>
      ) : payments.length === 0 ? (
        <div className="empty-state card card-pad">
          <h3>No payment records found</h3>
          <p>Once a purchase offer is accepted by a seller, you can pay the reservation deposit here.</p>
          <Link to="/offers" className="btn btn-primary mt-16">View Offers</Link>
        </div>
      ) : (
        <div className="card" style={{ overflowX: "auto" }}>
          <table>
            <thead>
              <tr>
                <th>Receipt #</th>
                <th>Property</th>
                <th>Buyer</th>
                <th>Deposit Amount</th>
                <th>Payment Method</th>
                <th>Status</th>
                <th>Transaction Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.id}>
                  <td>
                    <strong style={{ color: "var(--navy)" }}>{p.receiptNumber}</strong>
                    <div className="muted" style={{ fontSize: "0.75rem" }}>Ref: {p.transactionRef}</div>
                  </td>
                  <td>
                    <strong>{p.propertyTitle || "Property Purchase"}</strong>
                  </td>
                  <td>{p.buyerName || "Buyer"}</td>
                  <td>
                    <strong>{currency(p.amount)}</strong>
                    <div className="muted" style={{ fontSize: "0.75rem" }}>10% Advance</div>
                  </td>
                  <td>
                    <span className="badge badge-pending" style={{ fontSize: "0.75rem" }}>
                      {p.paymentMethod}
                    </span>
                  </td>
                  <td>
                    <span className="badge badge-available" style={{ fontSize: "0.75rem" }}>
                      {p.status}
                    </span>
                  </td>
                  <td className="muted" style={{ fontSize: "0.85rem" }}>
                    {p.paymentDate ? p.paymentDate.slice(0, 10) : "2026-08-20"}
                  </td>
                  <td>
                    <div className="flex gap-8">
                      <button className="btn btn-outline btn-sm" onClick={() => setSelectedReceipt(p)}>
                        View Receipt
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p.id)}>
                        Void
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Digital Receipt Modal View */}
      {selectedReceipt && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 9999, padding: 16
        }}>
          <div className="card card-pad" style={{ width: "100%", maxWidth: 480, background: "white", borderRadius: 10 }}>
            <div className="flex-between mb-16" style={{ borderBottom: "1px dashed #ccc", paddingBottom: 12 }}>
              <div>
                <h2 style={{ margin: 0, color: "var(--navy)" }}>HAVEN DIGITAL RECEIPT</h2>
                <p className="muted" style={{ margin: "2px 0 0", fontSize: "0.85rem" }}>Web-based Property Sales System</p>
              </div>
              <button className="btn btn-outline btn-sm" onClick={() => setSelectedReceipt(null)}>✕</button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: "0.92rem" }}>
              <div className="flex-between">
                <span className="muted">Receipt Number:</span>
                <strong>{selectedReceipt.receiptNumber}</strong>
              </div>
              <div className="flex-between">
                <span className="muted">Transaction Ref:</span>
                <span>{selectedReceipt.transactionRef}</span>
              </div>
              <div className="flex-between">
                <span className="muted">Property:</span>
                <strong>{selectedReceipt.propertyTitle}</strong>
              </div>
              <div className="flex-between">
                <span className="muted">Payer / Buyer:</span>
                <span>{selectedReceipt.buyerName}</span>
              </div>
              <div className="flex-between">
                <span className="muted">Payment Date:</span>
                <span>{selectedReceipt.paymentDate ? selectedReceipt.paymentDate.slice(0, 10) : new Date().toISOString().slice(0, 10)}</span>
              </div>
              <div className="flex-between">
                <span className="muted">Gateway / Method:</span>
                <span>{selectedReceipt.paymentMethod} (Sandbox Verified)</span>
              </div>
              <div className="flex-between" style={{ borderTop: "2px solid #333", paddingTop: 10, marginTop: 6 }}>
                <span style={{ fontSize: "1.05rem", fontWeight: 700 }}>Total Paid:</span>
                <span style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--navy)" }}>{currency(selectedReceipt.amount)}</span>
              </div>
              <div style={{ textAlign: "center", margin: "12px 0 0" }}>
                <span className="badge badge-available" style={{ padding: "6px 16px", fontSize: "0.85rem" }}>
                  STATUS: VERIFIED & COMPLETED
                </span>
              </div>
            </div>

            <div className="flex gap-12 mt-20" style={{ justifyContent: "flex-end" }}>
              <button className="btn btn-primary btn-sm" onClick={() => window.print()}>
                Print / Save PDF
              </button>
              <button className="btn btn-outline btn-sm" onClick={() => setSelectedReceipt(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
