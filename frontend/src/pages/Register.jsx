import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Register() {
  const nav = useNavigate();
  const { register } = useAuth();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      await register(username, email, password);
      nav("/catalog");
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
        <h2 className="text-xl font-bold">Register</h2>
        <p className="text-sm text-slate-600 mt-1">
          Create an account in 30 seconds.
        </p>

        {err && (
          <div className="mt-4 p-3 rounded-2xl bg-red-50 border border-red-200 text-sm text-red-700">
            {err}
          </div>
        )}

        <form className="mt-6 grid gap-3" onSubmit={onSubmit}>
          <input
            className="px-4 py-3 rounded-2xl border border-slate-300 outline-none focus:ring-2 focus:ring-slate-900"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            className="px-4 py-3 rounded-2xl border border-slate-300 outline-none focus:ring-2 focus:ring-slate-900"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="px-4 py-3 rounded-2xl border border-slate-300 outline-none focus:ring-2 focus:ring-slate-900"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            disabled={loading}
            className="px-4 py-3 rounded-2xl bg-slate-900 text-white text-sm font-medium hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create account"}
          </button>
        </form>

        <div className="mt-6 text-sm text-slate-600">
          Already have an account?{" "}
          <Link className="text-slate-900 font-medium hover:underline" to="/login">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}