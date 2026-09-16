import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="container page center">
      <div className="empty-state card card-pad">
        <h2>Page not found</h2>
        <p>The page you're looking for doesn't exist or may have moved.</p>
        <Link to="/" className="btn btn-primary mt-16">Back to browse</Link>
      </div>
    </div>
  );
}
