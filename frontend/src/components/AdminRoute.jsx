import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function AdminRoute({ children }) {
  const { isAuthed, isAdmin } = useAuth();

  if (!isAuthed) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/catalog" replace />;

  return children;
}