import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  getAllAppointments,
  getAppointmentsByBuyer,
  getAppointmentsByAgent,
  bookAppointment,
  updateAppointmentStatus,
  deleteAppointment
} from "../data/appointmentApi";
import { getAllProperties } from "../data/propertyApi";
import { useAuth } from "../context/AuthContext";
import { APPOINTMENTS, LISTINGS } from "../data/mockData";

const statusClass = {
  Pending: "badge-pending",
  Confirmed: "badge-confirmed",
  Declined: "badge-rejected",
  Rescheduled: "badge-underoffer",
  Completed: "badge-available",
  Cancelled: "badge-rejected"
};

export default function Appointments() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [appointments, setAppointments] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Create Form State
  const [showBookModal, setShowBookModal] = useState(window.location.pathname.endsWith("/new"));
  const [selectedPropertyId, setSelectedPropertyId] = useState(searchParams.get("listing") || "");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("10:00 AM");
  const [notes, setNotes] = useState("");
  const [booking, setBooking] = useState(false);

  // Reschedule State
  const [reschedulingId, setReschedulingId] = useState(null);
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleTime, setRescheduleTime] = useState("02:00 PM");

  async function loadData() {
    try {
      setLoading(true);
      setError("");
      const uid = user?.databaseId || user?.id;

      let appts = [];
      if (user?.role === "AGENT") {
        appts = await getAppointmentsByAgent(uid || 5).catch(() => []);
      } else if (user?.role === "BUYER") {
        appts = await getAppointmentsByBuyer(uid || 3).catch(() => []);
      } else {
        appts = await getAllAppointments().catch(() => []);
      }

      const props = await getAllProperties().catch(() => LISTINGS);
      setProperties(props || []);

      if (appts && appts.length > 0) {
        setAppointments(appts);
      } else {
        // Fallback to sample seed
        setAppointments(APPOINTMENTS.map(a => ({
          ...a,
          propertyTitle: properties.find(p => p.id == a.listingId)?.title || "Modern 3BR House in Nugegoda",
          appointmentDate: a.dateTime ? a.dateTime.slice(0, 10) : "2026-10-05",
          appointmentTime: a.dateTime ? a.dateTime.slice(11, 16) : "10:00 AM",
          buyerName: "Amara Fernando"
        })));
      }
    } catch (err) {
      setError(err.message || "Failed to load appointments");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [user]);

  async function handleBookSubmit(e) {
    e.preventDefault();
    if (!selectedPropertyId || !date) {
      setError("Please select a property and date.");
      return;
    }

    try {
      setBooking(true);
      setError("");
      setSuccess("");

      const selectedProp = properties.find(p => String(p.id) === String(selectedPropertyId)) || properties[0];
      const newAppt = await bookAppointment({
        propertyId: selectedProp?.id || 1,
        propertyTitle: selectedProp?.title || "Property Viewing",
        buyerId: user?.databaseId || user?.id || 3,
        buyerName: user?.name || "Buyer",
        buyerPhone: user?.phone || "077 123 4567",
        buyerEmail: user?.email || "buyer@example.com",
        agentId: 5,
        appointmentDate: date,
        appointmentTime: time,
        notes: notes
      });

      setAppointments((prev) => [newAppt, ...prev]);
      setSuccess("Viewing appointment booked successfully!");
      setShowBookModal(false);
      setNotes("");
    } catch (err) {
      setError(err.message || "Failed to book appointment");
    } finally {
      setBooking(false);
    }
  }

  async function handleStatusChange(id, status, newD = null, newT = null) {
    try {
      setError("");
      setSuccess("");
      const updated = await updateAppointmentStatus(id, {
        status,
        newDate: newD,
        newTime: newT,
        reason: status === "Rescheduled" ? "Rescheduled by agent/buyer" : null
      });

      setAppointments((prev) => prev.map((a) => (a.id === id ? updated : a)));
      setSuccess(`Appointment status updated to ${status}.`);
      setReschedulingId(null);
    } catch (err) {
      setError(err.message || "Failed to update appointment");
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Cancel and delete this appointment?")) return;
    try {
      setError("");
      setSuccess("");
      await deleteAppointment(id);
      setAppointments((prev) => prev.filter((a) => a.id !== id));
      setSuccess("Appointment cancelled and removed.");
    } catch (err) {
      setError(err.message || "Failed to delete appointment");
    }
  }

  return (
    <div className="container page">
      <div className="flex-between" style={{ alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
        <div>
          <span className="badge badge-accepted" style={{ marginBottom: 6, display: "inline-block" }}>
            Module 3 &middot; Randil B.R.K. (IT25101173)
          </span>
          <h1 style={{ margin: "4px 0" }}>Appointment Scheduling</h1>
          <p className="muted" style={{ margin: 0 }}>
            {user?.role === "AGENT"
              ? "Viewing inspection requests assigned to you by prospective buyers."
              : "Schedule, reschedule, or cancel on-site property viewings online."}
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowBookModal(true)}>
          + Book Viewing Appointment
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

      {loading ? (
        <div className="card card-pad center mt-24">Loading scheduled appointments...</div>
      ) : appointments.length === 0 ? (
        <div className="empty-state card card-pad mt-24">
          <h3>No appointments scheduled</h3>
          <p>{user?.role === "AGENT" ? "New buyer booking requests will appear here." : "Browse listings and book a viewing to get started."}</p>
          <Link to="/" className="btn btn-primary mt-16">Browse Properties</Link>
        </div>
      ) : (
        <div className="grid mt-24" style={{ gridTemplateColumns: "1fr", gap: 14 }}>
          {appointments.map((a) => {
            const isRescheduling = reschedulingId === a.id;
            return (
              <div key={a.id} className="card card-pad">
                <div className="flex-between" style={{ alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
                  <div>
                    <h3 style={{ margin: "0 0 4px" }}>
                      <Link to={`/listings/${a.propertyId || 1}`} style={{ textDecoration: "none", color: "var(--navy)" }}>
                        {a.propertyTitle || "Property Viewing"}
                      </Link>
                    </h3>
                    <p className="muted" style={{ margin: "2px 0", fontSize: "0.9rem" }}>
                      📅 <strong>{a.appointmentDate}</strong> at <strong>{a.appointmentTime}</strong>
                      {a.buyerName && <> &middot; Buyer: <strong>{a.buyerName}</strong></>}
                      {a.buyerPhone && <> ({a.buyerPhone})</>}
                    </p>
                    {a.notes && <p style={{ margin: "6px 0 0", fontSize: "0.85rem", color: "#555" }}>Note: {a.notes}</p>}
                    {a.cancellationReason && (
                      <p style={{ margin: "4px 0 0", fontSize: "0.82rem", color: "var(--danger)" }}>
                        Reason: {a.cancellationReason}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-8" style={{ alignItems: "center", flexWrap: "wrap" }}>
                    <span className={`badge ${statusClass[a.status] || "badge-pending"}`}>{a.status}</span>

                    {/* Agent / Admin Quick Status Controls */}
                    {a.status === "PENDING" && (
                      <>
                        <button className="btn btn-primary btn-sm" onClick={() => handleStatusChange(a.id, "CONFIRMED")}>
                          Confirm
                        </button>
                        <button className="btn btn-outline btn-sm" onClick={() => setReschedulingId(isRescheduling ? null : a.id)}>
                          Reschedule
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleStatusChange(a.id, "DECLINED")}>
                          Decline
                        </button>
                      </>
                    )}

                    {a.status === "CONFIRMED" && (
                      <>
                        <button className="btn btn-primary btn-sm" onClick={() => handleStatusChange(a.id, "COMPLETED")}>
                          Mark Completed
                        </button>
                        <button className="btn btn-outline btn-sm" onClick={() => setReschedulingId(isRescheduling ? null : a.id)}>
                          Reschedule
                        </button>
                      </>
                    )}

                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(a.id)}>
                      Cancel & Delete
                    </button>
                  </div>
                </div>

                {/* Inline Reschedule Dialog */}
                {isRescheduling && (
                  <div style={{ marginTop: 16, padding: 14, background: "#f8f9fa", borderRadius: 8, border: "1px solid #ddd" }}>
                    <h4 style={{ margin: "0 0 8px" }}>Reschedule Appointment</h4>
                    <div className="flex gap-12" style={{ alignItems: "center", flexWrap: "wrap" }}>
                      <input
                        type="date"
                        required
                        value={rescheduleDate || a.appointmentDate}
                        onChange={(e) => setRescheduleDate(e.target.value)}
                        style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid #ccc" }}
                      />
                      <select
                        value={rescheduleTime || a.appointmentTime}
                        onChange={(e) => setRescheduleTime(e.target.value)}
                        style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid #ccc" }}
                      >
                        <option value="09:00 AM">09:00 AM</option>
                        <option value="10:30 AM">10:30 AM</option>
                        <option value="02:00 PM">02:00 PM</option>
                        <option value="03:30 PM">03:30 PM</option>
                        <option value="05:00 PM">05:00 PM</option>
                      </select>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleStatusChange(a.id, "RESCHEDULED", rescheduleDate || a.appointmentDate, rescheduleTime || a.appointmentTime)}
                      >
                        Save New Time
                      </button>
                      <button className="btn btn-outline btn-sm" onClick={() => setReschedulingId(null)}>
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Booking Modal (Create Appointment) */}
      {showBookModal && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 9999, padding: 16
        }}>
          <div className="card card-pad" style={{ width: "100%", maxWidth: 500, background: "white" }}>
            <div className="flex-between mb-16">
              <h2 style={{ margin: 0 }}>Book Viewing Appointment</h2>
              <button className="btn btn-outline btn-sm" onClick={() => setShowBookModal(false)}>✕</button>
            </div>

            <form onSubmit={handleBookSubmit}>
              <div className="field">
                <label>Select Property *</label>
                <select
                  required
                  value={selectedPropertyId}
                  onChange={(e) => setSelectedPropertyId(e.target.value)}
                >
                  <option value="">-- Choose a Property --</option>
                  {properties.map((p) => (
                    <option key={p.id} value={p.id}>{p.title} ({p.location})</option>
                  ))}
                </select>
              </div>

              <div className="field-row">
                <div className="field">
                  <label>Viewing Date *</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
                <div className="field">
                  <label>Preferred Time *</label>
                  <select
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                  >
                    <option value="09:30 AM">09:30 AM - Morning</option>
                    <option value="11:00 AM">11:00 AM - Morning</option>
                    <option value="02:00 PM">02:00 PM - Afternoon</option>
                    <option value="03:30 PM">03:30 PM - Afternoon</option>
                    <option value="05:00 PM">05:00 PM - Evening</option>
                  </select>
                </div>
              </div>

              <div className="field">
                <label>Viewing Notes / Special Requests</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Inquiring about water pressure and vehicle clearance..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              <div className="flex gap-12 mt-16" style={{ justifyContent: "flex-end" }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowBookModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={booking}>
                  {booking ? "Submitting\u2026" : "Schedule Appointment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
