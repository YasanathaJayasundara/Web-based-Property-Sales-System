import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { USERS } from "../data/mockData";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    const result = login(email);
    if (result.ok) {
      navigate("/");
    } else {
      setError(result.error);
    }
  }

  return (
    <div className="container page" style={{ maxWidth: 440 }}>
      <h1>Log in</h1>
      <p className="muted">This is a frontend prototype, so any password works &mdash; just use one of the demo emails below.</p>

      <form onSubmit={handleSubmit} className="card card-pad mt-16">
        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
        </div>
        <div className="field">
          <label htmlFor="password">Password</label>
          <input id="password" type="password" placeholder="any password" />
        </div>
        {error && <p style={{ color: "var(--danger)", fontSize: "0.88rem" }}>{error}</p>}
        <button type="submit" className="btn btn-primary btn-block">Log in</button>
        <p className="muted mt-16" style={{ fontSize: "0.85rem" }}>
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </form>

      <div className="card card-pad mt-16">
        <h3 style={{ fontSize: "0.95rem" }}>Demo accounts</h3>
        <div className="flex" style={{ flexDirection: "column", gap: 8 }}>
          {USERS.map((u) => (
            <button key={u.id} type="button" className="btn btn-outline btn-sm" style={{ justifyContent: "space-between" }} onClick={() => setEmail(u.email)}>
              <span>{u.name}</span>
              <span className="muted">{u.role}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
