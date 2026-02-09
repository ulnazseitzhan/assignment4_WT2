import React, { useEffect, useState } from "react";
import { api } from "../api/client";
import { useAuth } from "../auth/AuthContext";
import Button from "../components/Button";

export default function Cart() {
  const { token } = useAuth();

  const [cart, setCart] = useState(null);
  const [totalInfo, setTotalInfo] = useState({ total: 0, itemsCount: 0 });

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  async function load() {
    setLoading(true);
    setErr("");

    try {
      const [c, t] = await Promise.all([
        api("/cart", { token }),
        api("/analytics/cart-total", { token })
      ]);

      setCart(c);
      setTotalInfo(t);
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

  async function setQty(laptopId, quantity) {
    try {
      const updated = await api(`/cart/set/${laptopId}`, {
        method: "PATCH",
        token,
        body: { quantity }
      });

      setCart(updated);

      const t = await api("/analytics/cart-total", { token });
      setTotalInfo(t);
    } catch (e) {
      alert(e.message);
    }
  }

  async function removeItem(laptopId) {
    try {
      const updated = await api(`/cart/remove/${laptopId}`, {
        method: "DELETE",
        token
      });

      setCart(updated);

      const t = await api("/analytics/cart-total", { token });
      setTotalInfo(t);
    } catch (e) {
      alert(e.message);
    }
  }

  async function checkout() {
    try {
      await api("/orders/checkout", { method: "POST", token });
      alert("Order created!");
      await load();
    } catch (e) {
      alert(e.message);
    }
  }

  if (loading) return <div className="text-slate-600">Loading...</div>;

  return (
    <div className="grid gap-6">
      <div className="bg-white border border-slate-200 rounded-3xl p-6">
        <h2 className="text-xl font-bold">Cart</h2>
        <p className="text-sm text-slate-600 mt-1">
          MongoDB advanced operators: $inc / $set / $pull with positional ($).
        </p>
      </div>

      {err && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-sm text-red-700">
          {err}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 grid gap-3">
          {cart?.items?.length ? (
            cart.items.map((item) => {
              const laptop = item.laptopId;

              return (
                <div
                  key={laptop?._id}
                  className="bg-white border border-slate-200 rounded-3xl p-5 flex items-center justify-between gap-4"
                >
                  <div>
                    <div className="text-sm text-slate-500">{laptop?.brand}</div>
                    <div className="font-semibold">{laptop?.name}</div>
                    <div className="text-sm text-slate-600 mt-1">
                      ${laptop?.price} each
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) =>
                        setQty(laptop._id, Number(e.target.value))
                      }
                      className="w-20 px-3 py-2 rounded-xl border border-slate-300"
                    />

                    <button
                      onClick={() => removeItem(laptop._id)}
                      className="px-4 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-slate-600">Cart is empty.</div>
          )}
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 h-fit">
          <div className="font-semibold">Summary</div>

          <div className="mt-3 text-sm text-slate-600">
            Items: {totalInfo.itemsCount}
          </div>

          <div className="mt-1 text-2xl font-bold">${totalInfo.total}</div>

          <Button
            disabled={!cart?.items?.length}
            onClick={checkout}
            className="mt-5 w-full"
          >
            Checkout
          </Button>

          <div className="mt-4 text-xs text-slate-500">
            Checkout creates an Order, decreases stock using $inc, and clears cart
            using $set.
          </div>
        </div>
      </div>
    </div>
  );
}