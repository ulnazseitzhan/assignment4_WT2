import React from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

function NavItem({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `px-3 py-2 rounded-xl text-sm font-medium transition ${
          isActive
            ? "bg-slate-900 text-white"
            : "text-slate-700 hover:bg-slate-100"
        }`
      }
    >
      {children}
    </NavLink>
  );
}

export default function Navbar() {
  const { isAuthed, isAdmin, user, logout } = useAuth();

  return (
    <div className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <Link to="/" className="font-bold text-lg tracking-tight">
          LapStore
        </Link>

        <div className="flex items-center gap-2 flex-wrap">
          <NavItem to="/catalog">Catalog</NavItem>

          {isAuthed && <NavItem to="/cart">Cart</NavItem>}
          {isAuthed && <NavItem to="/orders">Orders</NavItem>}

          {isAdmin && <NavItem to="/admin/laptops">Admin</NavItem>}
          {isAdmin && <NavItem to="/analytics">Analytics</NavItem>}
        </div>

        <div className="flex items-center gap-3">
          {isAuthed ? (
            <>
              <div className="text-sm text-slate-600 hidden sm:block">
                {user?.username}{" "}
                <span className="text-xs text-slate-400">({user?.role})</span>
              </div>

              <button
                onClick={logout}
                className="px-3 py-2 rounded-xl bg-slate-900 text-white text-sm hover:opacity-90"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link className="text-sm text-slate-700 hover:underline" to="/login">
                Login
              </Link>

              <Link
                className="px-3 py-2 rounded-xl bg-slate-900 text-white text-sm hover:opacity-90"
                to="/register"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}