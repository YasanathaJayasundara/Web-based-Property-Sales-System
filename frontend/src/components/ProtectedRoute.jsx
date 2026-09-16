import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, roles }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (roles && !roles.includes(user.role)) {
    return (
      <div className="container page">
        <div className="empty-state card card-pad">
          <h3>You don't have access to this page</h3>
          <p>This section is only available to {roles.join(" or ").toLowerCase()} accounts.</p>
        </div>
      </div>
    );
  }
  return children;
}
