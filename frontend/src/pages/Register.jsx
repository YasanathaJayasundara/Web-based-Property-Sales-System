import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", role: "BUYER", password: "" });

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    // In the real app, this posts to POST /api/users (Spring Boot) to create the account.
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="container page" style={{ maxWidth: 480 }}>
        <div className="card card-pad center">
          <h2>Account created</h2>
          <p>Welcome, {form.name.split(" ")[0] || "there"}. You can now log in with {form.email}.</p>
          <Link to="/login" className="btn btn-primary mt-16">Go to login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container page" style={{ maxWidth: 460 }}>
      <h1>Create an account</h1>
      <p className="muted">Register as a buyer to book viewings and make offers, or as a seller/agent to list properties.</p>

      <form onSubmit={handleSubmit} className="card card-pad mt-16">
        <div className="field">
          <label htmlFor="name">Full name</label>
          <input id="name" required value={form.name} onChange={(e) => update("name", e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" required value={form.email} onChange={(e) => update("email", e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="phone">Phone number</label>
          <input id="phone" required value={form.phone} onChange={(e) => update("phone", e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="role">I am a&hellip;</label>
          <select id="role" value={form.role} onChange={(e) => update("role", e.target.value)}>
            <option value="BUYER">Buyer</option>
            <option value="SELLER">Seller / Property owner</option>
            <option value="AGENT">Real estate agent</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="password">Password</label>
          <input id="password" type="password" required value={form.password} onChange={(e) => update("password", e.target.value)} />
        </div>
        <button type="submit" className="btn btn-primary btn-block">Create account</button>
        <p className="muted mt-16" style={{ fontSize: "0.85rem" }}>
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </form>
    </div>
  );
}
