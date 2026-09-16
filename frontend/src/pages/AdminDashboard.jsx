import React, { useState } from "react";
import { USERS, LISTINGS, REVIEWS, currency } from "../data/mockData";

export default function AdminDashboard() {
  const [users, setUsers] = useState(USERS);
  const [reviews, setReviews] = useState(REVIEWS);
  const [tab, setTab] = useState("users");

  function toggleSuspend(id) {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, suspended: !u.suspended } : u)));
  }

  function removeReview(id) {
    if (confirm("Remove this review? This can't be undone.")) {
      setReviews((prev) => prev.filter((r) => r.id !== id));
    }
  }

  return (
    <div className="container page">
      <h1>Admin Dashboard</h1>
      <p className="muted">Manage user accounts, moderate reviews, and oversee listings.</p>

      <div className="flex gap-8 mt-16 mb-16">
        {[["users", "Users"], ["reviews", "Review Moderation"], ["listings", "All Listings"]].map(([key, label]) => (
          <button key={key} className={tab === key ? "btn btn-primary btn-sm" : "btn btn-outline btn-sm"} onClick={() => setTab(key)}>
            {label}
          </button>
        ))}
      </div>

      {tab === "users" && (
        <div className="card" style={{ overflow: "hidden" }}>
          <table>
            <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.name}</td>
                  <td className="muted">{u.email}</td>
                  <td>{u.role}</td>
                  <td>{u.suspended ? <span className="badge badge-rejected">Suspended</span> : <span className="badge badge-available">Active</span>}</td>
                  <td>
                    {u.role !== "ADMIN" && (
                      <button className={u.suspended ? "btn btn-outline btn-sm" : "btn btn-danger btn-sm"} onClick={() => toggleSuspend(u.id)}>
                        {u.suspended ? "Reinstate" : "Suspend"}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "reviews" && (
        <div className="flex" style={{ flexDirection: "column", gap: 12 }}>
          {reviews.length === 0 ? (
            <div className="empty-state card card-pad"><h3>No reviews to moderate</h3></div>
          ) : reviews.map((r) => (
            <div key={r.id} className="card card-pad flex-between">
              <div>
                <p style={{ margin: 0 }}>&ldquo;{r.comment}&rdquo;</p>
                <p className="muted" style={{ fontSize: "0.8rem", margin: "4px 0 0" }}>Rating: {r.rating}/5 &middot; {r.createdAt}</p>
              </div>
              <button className="btn btn-danger btn-sm" onClick={() => removeReview(r.id)}>Remove</button>
            </div>
          ))}
        </div>
      )}

      {tab === "listings" && (
        <div className="card" style={{ overflow: "hidden" }}>
          <table>
            <thead><tr><th>Title</th><th>Location</th><th>Price</th><th>Status</th></tr></thead>
            <tbody>
              {LISTINGS.map((l) => (
                <tr key={l.id}>
                  <td>{l.title}</td>
                  <td className="muted">{l.location}</td>
                  <td>{currency(l.price)}</td>
                  <td>{l.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
