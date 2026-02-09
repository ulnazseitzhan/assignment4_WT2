import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Catalog from "./pages/Catalog";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import AdminLaptops from "./pages/AdminLaptops";
import Analytics from "./pages/Analytics";

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/catalog" element={<Catalog />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            }
          />

          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/laptops"
            element={
              <AdminRoute>
                <AdminLaptops />
              </AdminRoute>
            }
          />

          <Route
            path="/analytics"
            element={
              <AdminRoute>
                <Analytics />
              </AdminRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
}