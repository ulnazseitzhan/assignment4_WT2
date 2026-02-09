import React, { useEffect, useState } from "react";
import { api } from "../api/client";
import { useAuth } from "../auth/AuthContext";

export default function Orders() {
  const { token } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  async function load() {
    setLoading(true);
    setErr("");

    try {
      const data = await api("/orders/my", { token });
      setOrders(data);
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

  if (loading) return <div className="text-slate-600">Loading...</div>;

  return (
    <div className="grid gap-6">
      <div className="bg-white border border-slate-200 rounded-3xl p-6">
        <h2 className="text-xl font-bold">My Orders</h2>
        <p className="text-sm text-slate-600 mt-1">
          Orders are stored in MongoDB and referenced by userId.
        </p>
      </div>

      {err && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-sm text-red-700">
          {err}
        </div>
      )}

      <div className="grid gap-4">
        {orders.length ? (
          orders.map((o) => (
            <div
              key={o._id}
              className="bg-white border border-slate-200 rounded-3xl p-6"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="font-semibold">
                  Order #{o._id.slice(-6).toUpperCase()}
                </div>

                <div className="text-sm text-slate-600">{o.status}</div>
              </div>

              <div className="mt-2 text-sm text-slate-500">
                Created: {new Date(o.createdAt).toLocaleString()}
              </div>

              <div className="mt-4 grid gap-2">
                {o.items.map((it, idx) => (
                  <div key={idx} className="flex items-center justify-between text-sm">
                    <div>
                      <span className="text-slate-500">{it.brand}</span>{" "}
                      <span className="font-medium">{it.name}</span>{" "}
                      <span className="text-slate-500">x{it.quantity}</span>
                    </div>

                    <div className="font-medium">
                      ${it.priceAtPurchase * it.quantity}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-slate-200 flex items-center justify-between">
                <div className="text-sm text-slate-600">Total</div>
                <div className="text-xl font-bold">${o.totalPrice}</div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-slate-600">No orders yet.</div>
        )}
      </div>
    </div>
  );
}