import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  const linkStyle = ({ isActive }) => ({
    color: isActive ? "var(--gold)" : "white",
    fontWeight: 600,
    fontSize: "0.92rem",
  });

  return (
    <header style={{ background: "var(--navy)" }}>
      <div className="container flex-between" style={{ height: 66 }}>
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
            <path d="M13 2L2 11h3v12h6v-7h4v7h6V11h3L13 2z" fill="#C9A227" />
          </svg>
          <span style={{ fontFamily: "var(--font-serif)", fontSize: "1.35rem", fontWeight: 700, color: "white" }}>
            Haven
          </span>
        </Link>

        <nav className="flex gap-16" style={{ alignItems: "center" }}>
          <NavLink to="/" style={linkStyle} end>Browse</NavLink>
          {user && (user.role === "SELLER" || user.role === "AGENT") && (
            <NavLink to="/my-listings" style={linkStyle}>My Listings</NavLink>
          )}
          {user && (
            <NavLink to="/appointments" style={linkStyle}>Appointments</NavLink>
          )}
          {user && (
            <NavLink to="/offers" style={linkStyle}>Offers</NavLink>
          )}
          {user && user.role === "BUYER" && (
            <NavLink to="/reviews" style={linkStyle}>Reviews</NavLink>
          )}
          {user && user.role === "BUYER" && (
            <NavLink to="/payments" style={linkStyle}>Payments</NavLink>
          )}
          {user && user.role === "ADMIN" && (
            <>
              <NavLink to="/admin" style={linkStyle}>Admin</NavLink>
              <NavLink to="/reports" style={linkStyle}>Reports</NavLink>
            </>
          )}
          {user ? (
            <div className="flex gap-12" style={{ alignItems: "center", marginLeft: 8 }}>
              <NavLink to="/profile" style={linkStyle}>{user.name.split(" ")[0]}</NavLink>
              <button className="btn btn-gold btn-sm" onClick={handleLogout}>Log out</button>
            </div>
          ) : (
            <Link to="/login" className="btn btn-gold btn-sm">Log in</Link>
          )}
        </nav>
      </div>
    </header>
  );
}
