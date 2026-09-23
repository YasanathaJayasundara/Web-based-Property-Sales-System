import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user } = useAuth();
  const [form, setForm] = useState({ name: user.name, phone: user.phone, email: user.email });
  const [saved, setSaved] = useState(false);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    setSaved(false);
  }

  function handleSubmit(e) {
    e.preventDefault();
    // Real app: PUT /api/users/{id} (Spring Boot)
    setSaved(true);
  }

  return (
    <div className="container page" style={{ maxWidth: 460 }}>
      <h1>My Profile</h1>
      <p className="muted">Manage your personal and contact details. Role: <strong>{user.role}</strong></p>

      <form onSubmit={handleSubmit} className="card card-pad mt-16">
        <div className="field">
          <label htmlFor="name">Full name</label>
          <input id="name" value={form.name} onChange={(e) => update("name", e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" value={form.email} onChange={(e) => update("email", e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="phone">Phone number</label>
          <input id="phone" value={form.phone} onChange={(e) => update("phone", e.target.value)} />
        </div>
        {saved && <p style={{ color: "var(--sage)", fontSize: "0.88rem" }}>Profile updated successfully.</p>}
        <button type="submit" className="btn btn-primary btn-block">Save changes</button>
      </form>

      <div className="card card-pad mt-16">
        <h3 style={{ fontSize: "0.95rem" }}>Password</h3>
        <p className="muted" style={{ fontSize: "0.85rem" }}>Forgot your password, or want to change it?</p>
        <button className="btn btn-outline btn-sm">Reset password</button>
      </div>
    </div>
  );
}
