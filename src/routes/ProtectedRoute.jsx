import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../App";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useContext(UserContext);

  if (!user?.token) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/dashboard" replace />;

  return children;
}
