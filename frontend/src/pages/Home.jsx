import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Home() {
  const { isAuthed } = useAuth();

  return (
    <div className="grid gap-8">
      <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
        <div className="text-sm text-slate-500 mb-2">
          Advanced Databases (NoSQL) • Endterm Project
        </div>

        <h1 className="text-3xl font-bold tracking-tight">
          Laptop Store Web Application
        </h1>

        <p className="mt-3 text-slate-600 leading-relaxed max-w-2xl">
          Full-stack project with MongoDB, REST API, Authentication, Advanced updates
          ($inc, $push, $pull, $set), and Aggregation pipelines for analytics.
        </p>

        <div className="mt-6 flex gap-3 flex-wrap">
          <Link
            to="/catalog"
            className="px-5 py-3 rounded-2xl bg-slate-900 text-white text-sm font-medium hover:opacity-90"
          >
            Open Catalog
          </Link>

          {!isAuthed && (
            <Link
              to="/register"
              className="px-5 py-3 rounded-2xl bg-white border border-slate-300 text-slate-800 text-sm font-medium hover:bg-slate-50"
            >
              Create Account
            </Link>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {[
          {
            title: "MongoDB Aggregations",
            desc: "Multi-stage pipelines for cart totals and top brands."
          },
          {
            title: "Advanced Updates",
            desc: "$inc, $push, $pull, $set + positional operator ($)."
          },
          {
            title: "Admin Panel",
            desc: "CRUD laptops + search, filtering, sorting and pagination."
          }
        ].map((x) => (
          <div
            key={x.title}
            className="bg-white border border-slate-200 rounded-3xl p-6"
          >
            <div className="font-semibold">{x.title}</div>
            <div className="mt-2 text-sm text-slate-600">{x.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}