import React from "react";

export default function Footer() {
  return (
    <footer style={{ background: "var(--navy-dark)", color: "var(--gold-light)", marginTop: 64 }}>
      <div className="container" style={{ padding: "28px 24px", fontSize: "0.85rem" }}>
        <div className="flex-between">
          <span>&copy; 2026 Haven Property Sales System &mdash; Academic Project (SE2030)</span>
          <span className="muted" style={{ color: "var(--gold-light)" }}>Built with React &middot; Spring Boot &middot; MySQL</span>
        </div>
      </div>
    </footer>
  );
}
