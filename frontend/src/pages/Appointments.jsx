import React, { useMemo, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { APPOINTMENTS, LISTINGS, findListing, findUser } from "../data/mockData";
import { useAuth } from "../context/AuthContext";

const statusClass = { Pending: "badge-pending", Confirmed: "badge-confirmed", Declined: "badge-rejected", Rescheduled: "badge-underoffer" };

export default function Appointments() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const isNew = window.location.pathname.endsWith("/new");
  const [appointments, setAppointments] = useState(APPOINTMENTS);

  const mine = user.role === "AGENT"
    ? appointments.filter((a) => a.agentId === user.id)
    : appointments.filter((a) => a.buyerId === user.id);

  function handleAction(id, status) {
    setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
  }

  if (isNew) {
    return <NewAppointment listingId={searchParams.get("listing")} onCreate={(appt) => setAppointments((prev) => [...prev, appt])} />;
  }

  return (
    <div className="container page">
      <h1>Appointments</h1>
      <p className="muted">
        {user.role === "AGENT" ? "Viewing requests for your listings." : "Viewings you've requested."}
      </p>

      {mine.length === 0 ? (
        <div className="empty-state card card-pad">
          <h3>No appointments yet</h3>
          <p>{user.role === "AGENT" ? "Requests from buyers will appear here." : "Browse listings and request a viewing to get started."}</p>
          {user.role !== "AGENT" && <Link to="/" className="btn btn-primary mt-16">Browse listings</Link>}
        </div>
      ) : (
        <div className="grid" style={{ gridTemplateColumns: "1fr", gap: 12 }}>
          {mine.map((a) => {
            const listing = findListing(a.listingId);
            const counterparty = user.role === "AGENT" ? findUser(a.buyerId) : findUser(a.agentId);
            return (
              <div key={a.id} className="card card-pad flex-between">
                <div>
                  <Link to={`/listings/${listing.id}`} style={{ fontWeight: 600, textDecoration: "none" }}>{listing.title}</Link>
                  <p className="muted" style={{ margin: "2px 0" }}>
                    {new Date(a.dateTime).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })}
                    {counterparty && <> &middot; {user.role === "AGENT" ? "Buyer" : "Agent"}: {counterparty.name}</>}
                  </p>
                </div>
                <div className="flex gap-8" style={{ alignItems: "center" }}>
                  <span className={`badge ${statusClass[a.status]}`}>{a.status}</span>
                  {user.role === "AGENT" && a.status === "Pending" && (
                    <>
                      <button className="btn btn-primary btn-sm" onClick={() => handleAction(a.id, "Confirmed")}>Confirm</button>
                      <button className="btn btn-outline btn-sm" onClick={() => handleAction(a.id, "Rescheduled")}>Reschedule</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleAction(a.id, "Declined")}>Decline</button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function NewAppointment({ listingId, onCreate }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const listing = findListing(listingId) || LISTINGS[0];
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [error, setError] = useState("");
  const [conflict, setConflict] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (!date || !time) {
      setError("Please choose both a date and a time.");
      return;
    }
    // Simulate a conflict check against existing bookings for this listing/agent/time.
    const clash = APPOINTMENTS.some((a) => a.listingId === listing.id && a.dateTime.startsWith(date));
    if (clash && !conflict) {
      setConflict(true);
      setError("That date already has a booking for this property. Please choose a different date and time, or submit again to request anyway.");
      return;
    }
    onCreate({
      id: "a" + Date.now(),
      listingId: listing.id,
      buyerId: user.id,
      agentId: listing.agentId,
      dateTime: `${date}T${time}:00`,
      status: "Pending",
    });
    navigate("/appointments");
  }

  return (
    <div className="container page" style={{ maxWidth: 480 }}>
      <h1>Request an appointment</h1>
      <p className="muted">Viewing: <strong>{listing.title}</strong></p>

      <form onSubmit={handleSubmit} className="card card-pad mt-16">
        <div className="field-row">
          <div className="field">
            <label htmlFor="date">Preferred date</label>
            <input id="date" type="date" required value={date} onChange={(e) => { setDate(e.target.value); setConflict(false); }} />
          </div>
          <div className="field">
            <label htmlFor="time">Preferred time</label>
            <input id="time" type="time" required value={time} onChange={(e) => { setTime(e.target.value); setConflict(false); }} />
          </div>
        </div>
        {error && <p style={{ color: "var(--danger)", fontSize: "0.88rem" }}>{error}</p>}
        <button type="submit" className="btn btn-primary btn-block">{conflict ? "Request anyway" : "Request appointment"}</button>
      </form>
    </div>
  );
}
