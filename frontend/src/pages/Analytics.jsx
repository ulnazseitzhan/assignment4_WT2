import React, { useEffect, useState } from "react";
import { api } from "../api/client";
import { useAuth } from "../auth/AuthContext";

export default function Analytics() {
  const { token } = useAuth();

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  async function load() {
    setLoading(true);
    setErr("");

    try {
      const data = await api("/analytics/top-brands", { token });
      setRows(data);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="grid gap-6">
      <div className="bg-white border border-slate-200 rounded-3xl p-6">
        <h2 className="text-xl font-bold">Analytics (Aggregation)</h2>
        <p className="text-sm text-slate-600 mt-1">
          Multi-stage pipeline: $unwind → $group → $sort → $limit → $project.
        </p>
      </div>

      {err && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-sm text-red-700">
          {err}
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-3xl p-6">
        {loading ? (
          <div className="text-slate-600">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500 border-b border-slate-200">
                  <th className="py-3">Brand</th>
                  <th className="py-3">Orders count</th>
                  <th className="py-3">Units sold</th>
                  <th className="py-3">Revenue</th>
                </tr>
              </thead>

              <tbody>
                {rows.map((r) => (
                  <tr key={r.brand} className="border-b border-slate-100">
                    <td className="py-3 font-medium">{r.brand}</td>
                    <td className="py-3">{r.ordersCount}</td>
                    <td className="py-3">{r.unitsSold}</td>
                    <td className="py-3 font-semibold">${r.revenue}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {!rows.length && (
              <div className="text-slate-600 mt-3">
                No data yet. Create orders first (checkout).
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}