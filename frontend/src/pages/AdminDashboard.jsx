import React, { useEffect, useState } from "react";
import {
  getAllUsers,
  registerUser,
  updateUser,
  toggleSuspendUser,
  deleteUser
} from "../data/userPaymentApi";
import { getAllReviews, deleteReview } from "../data/reviewApi";
import { getAllProperties } from "../data/propertyApi";
import { getAllPayments } from "../data/userPaymentApi";
import { USERS, REVIEWS, LISTINGS, currency } from "../data/mockData";

export default function AdminDashboard() {
  const [tab, setTab] = useState("users");
  const [users, setUsers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [properties, setProperties] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Create User Modal State
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [userFormData, setUserFormData] = useState({
    name: "",
    email: "",
    password: "Password@123",
    role: "BUYER",
    phone: "",
    address: ""
  });

  async function loadData() {
    try {
      setLoading(true);
      setError("");
      const [usersData, reviewsData, propsData, payData] = await Promise.all([
        getAllUsers().catch(() => []),
        getAllReviews().catch(() => []),
        getAllProperties().catch(() => []),
        getAllPayments().catch(() => [])
      ]);

      setUsers(usersData && usersData.length > 0 ? usersData : USERS);
      setReviews(reviewsData && reviewsData.length > 0 ? reviewsData : REVIEWS);
      setProperties(propsData && propsData.length > 0 ? propsData : LISTINGS);
      setPayments(payData || []);
    } catch (err) {
      setError(err.message || "Failed to load admin data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleCreateUser(e) {
    e.preventDefault();
    try {
      setError("");
      setSuccess("");
      const created = await registerUser(userFormData);
      setUsers((prev) => [created, ...prev]);
      setSuccess(`User account created for ${created.name} (${created.role}).`);
      setShowAddUserModal(false);
      setUserFormData({
        name: "",
        email: "",
        password: "Password@123",
        role: "BUYER",
        phone: "",
        address: ""
      });
    } catch (err) {
      setError(err.message || "Failed to create user account");
    }
  }

  async function handleToggleSuspend(id) {
    try {
      setError("");
      setSuccess("");
      const updated = await toggleSuspendUser(id);
      setUsers((prev) => prev.map((u) => (u.id === id ? updated : u)));
      setSuccess(`User status updated to ${updated.status}.`);
    } catch (err) {
      setError(err.message || "Failed to update user status");
    }
  }

  async function handleDeleteUser(id, name) {
    if (!window.confirm(`Delete user "${name}"? This action cannot be reversed.`)) return;
    try {
      setError("");
      setSuccess("");
      await deleteUser(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
      setSuccess(`User "${name}" deleted successfully.`);
    } catch (err) {
      setError(err.message || "Failed to delete user");
    }
  }

  async function handleRemoveReview(id) {
    if (!window.confirm("Remove this review? This cannot be undone.")) return;
    try {
      setError("");
      setSuccess("");
      await deleteReview(id);
      setReviews((prev) => prev.filter((r) => r.id !== id));
      setSuccess("Review moderated and removed.");
    } catch (err) {
      setError(err.message || "Failed to remove review");
    }
  }

  return (
    <div className="container page">
      <div className="flex-between" style={{ alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
        <div>
          <span className="badge badge-accepted" style={{ marginBottom: 6, display: "inline-block" }}>
            Module 6 &middot; Wanniarachchi W.K.A.N (IT25200151)
          </span>
          <h1 style={{ margin: "4px 0" }}>System Administration Dashboard</h1>
          <p className="muted" style={{ margin: 0 }}>
            Centralized platform governance: user account roles, review moderation, and database oversight.
          </p>
        </div>

        {tab === "users" && (
          <button className="btn btn-primary" onClick={() => setShowAddUserModal(true)}>
            + Add New User Account
          </button>
        )}
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

      {/* Tabs */}
      <div className="flex gap-8 mt-20 mb-16">
        {[
          ["users", `User Management (${users.length})`],
          ["reviews", `Review Moderation (${reviews.length})`],
          ["listings", `Properties Overview (${properties.length})`]
        ].map(([key, label]) => (
          <button
            key={key}
            className={tab === key ? "btn btn-primary btn-sm" : "btn btn-outline btn-sm"}
            onClick={() => setTab(key)}
          >
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="card card-pad center">Loading dashboard records...</div>
      ) : (
        <>
          {/* USERS TAB (Full CRUD) */}
          {tab === "users" && (
            <div className="card" style={{ overflowX: "auto" }}>
              <table>
                <thead>
                  <tr>
                    <th>User ID</th>
                    <th>Name</th>
                    <th>Email Address</th>
                    <th>Role</th>
                    <th>Contact Phone</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id}>
                      <td className="muted">#{u.id}</td>
                      <td><strong>{u.name}</strong></td>
                      <td className="muted">{u.email}</td>
                      <td>
                        <span className="badge badge-pending" style={{ fontSize: "0.75rem" }}>
                          {u.role}
                        </span>
                      </td>
                      <td>{u.phone || "N/A"}</td>
                      <td>
                        <span className={`badge ${u.status === "ACTIVE" || !u.suspended ? "badge-available" : "badge-rejected"}`}>
                          {u.status || (u.suspended ? "SUSPENDED" : "ACTIVE")}
                        </span>
                      </td>
                      <td>
                        <div className="flex gap-8" style={{ alignItems: "center" }}>
                          {u.role !== "ADMIN" && (
                            <button
                              className={u.status === "SUSPENDED" || u.suspended ? "btn btn-primary btn-sm" : "btn btn-outline btn-sm"}
                              onClick={() => handleToggleSuspend(u.id)}
                            >
                              {u.status === "SUSPENDED" || u.suspended ? "Reinstate" : "Suspend"}
                            </button>
                          )}
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDeleteUser(u.id, u.name)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* REVIEWS MODERATION TAB */}
          {tab === "reviews" && (
            <div className="flex" style={{ flexDirection: "column", gap: 12 }}>
              {reviews.length === 0 ? (
                <div className="empty-state card card-pad"><h3>No reviews to moderate</h3></div>
              ) : reviews.map((r) => (
                <div key={r.id} className="card card-pad flex-between" style={{ alignItems: "center" }}>
                  <div>
                    <p style={{ margin: "0 0 4px", fontSize: "0.95rem" }}>&ldquo;{r.comment}&rdquo;</p>
                    <p className="muted" style={{ fontSize: "0.8rem", margin: 0 }}>
                      Rating: <strong>{r.rating}/5 Stars</strong> &middot; Buyer: {r.buyerName || "Buyer"} &middot; {r.createdAt ? r.createdAt.slice(0, 10) : "2026-08-22"}
                    </p>
                  </div>
                  <button className="btn btn-danger btn-sm" onClick={() => handleRemoveReview(r.id)}>
                    Remove Review
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* LISTINGS OVERVIEW TAB */}
          {tab === "listings" && (
            <div className="card" style={{ overflowX: "auto" }}>
              <table>
                <thead>
                  <tr>
                    <th>Property Title</th>
                    <th>Type</th>
                    <th>Location</th>
                    <th>Price</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {properties.map((p) => (
                    <tr key={p.id}>
                      <td><strong>{p.title}</strong></td>
                      <td>{p.propertyType || p.type}</td>
                      <td className="muted">{p.location} {p.city ? `, ${p.city}` : ""}</td>
                      <td>{currency(p.price)}</td>
                      <td>
                        <span className="badge badge-available">{p.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* Add User Modal Dialog */}
      {showAddUserModal && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 9999, padding: 16
        }}>
          <div className="card card-pad" style={{ width: "100%", maxWidth: 480, background: "white" }}>
            <div className="flex-between mb-16">
              <h2 style={{ margin: 0 }}>Create User Account</h2>
              <button className="btn btn-outline btn-sm" onClick={() => setShowAddUserModal(false)}>✕</button>
            </div>

            <form onSubmit={handleCreateUser}>
              <div className="field">
                <label>Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kasun Jayawardena"
                  value={userFormData.name}
                  onChange={(e) => setUserFormData({ ...userFormData, name: e.target.value })}
                />
              </div>

              <div className="field">
                <label>Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. kasun@example.com"
                  value={userFormData.email}
                  onChange={(e) => setUserFormData({ ...userFormData, email: e.target.value })}
                />
              </div>

              <div className="field-row">
                <div className="field">
                  <label>Role *</label>
                  <select
                    value={userFormData.role}
                    onChange={(e) => setUserFormData({ ...userFormData, role: e.target.value })}
                  >
                    <option value="BUYER">Buyer</option>
                    <option value="SELLER">Seller / Owner</option>
                    <option value="AGENT">Real Estate Agent</option>
                    <option value="ADMIN">Platform Admin</option>
                  </select>
                </div>
                <div className="field">
                  <label>Initial Password *</label>
                  <input
                    type="password"
                    required
                    value={userFormData.password}
                    onChange={(e) => setUserFormData({ ...userFormData, password: e.target.value })}
                  />
                </div>
              </div>

              <div className="field-row">
                <div className="field">
                  <label>Phone Number</label>
                  <input
                    type="text"
                    placeholder="077 123 4567"
                    value={userFormData.phone}
                    onChange={(e) => setUserFormData({ ...userFormData, phone: e.target.value })}
                  />
                </div>
                <div className="field">
                  <label>City / Address</label>
                  <input
                    type="text"
                    placeholder="Colombo 07"
                    value={userFormData.address}
                    onChange={(e) => setUserFormData({ ...userFormData, address: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex gap-12 mt-16" style={{ justifyContent: "flex-end" }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowAddUserModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
