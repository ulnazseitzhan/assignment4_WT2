import React, { useEffect, useMemo, useState } from "react";
import { api } from "../api/client";
import { useAuth } from "../auth/AuthContext";
import LaptopCard from "../components/LaptopCard";

export default function Catalog() {
  const { token, isAuthed } = useAuth();

  const [data, setData] = useState({ items: [], page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [search, setSearch] = useState("");
  const [brand, setBrand] = useState("");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);

  const brands = useMemo(() => {
    const set = new Set(data.items.map((x) => x.brand));
    return ["", ...Array.from(set)];
  }, [data.items]);

  async function load(p = page) {
    setLoading(true);
    setErr("");

    try {
      const q = new URLSearchParams();
      if (search) q.set("search", search);
      if (brand) q.set("brand", brand);
      if (sort) q.set("sort", sort);

      q.set("page", String(p));
      q.set("limit", "12");

      const res = await api(`/laptops?${q.toString()}`);
      setData(res);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load(page);
    // eslint-disable-next-line
  }, [page]);

  function onApply() {
    setPage(1);
    load(1);
  }

  async function addToCart(laptopId) {
    try {
      await api(`/cart/add/${laptopId}`, { method: "PATCH", token });
      alert("Added to cart");
    } catch (e) {
      alert(e.message);
    }
  }

  return (
    <div className="grid gap-6">
      <div className="bg-white border border-slate-200 rounded-3xl p-6">
        <div className="flex flex-col md:flex-row md:items-end gap-3 justify-between">
          <div>
            <h2 className="text-xl font-bold">Catalog</h2>
            <p className="text-sm text-slate-600 mt-1">
              Search, filter, sort — all backed by MongoDB indexes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 w-full md:w-auto">
            <input
              className="px-4 py-3 rounded-2xl border border-slate-300 outline-none focus:ring-2 focus:ring-slate-900"
              placeholder="Search laptops..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              className="px-4 py-3 rounded-2xl border border-slate-300"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
            >
              {brands.map((b) => (
                <option key={b} value={b}>
                  {b || "All brands"}
                </option>
              ))}
            </select>

            <select
              className="px-4 py-3 rounded-2xl border border-slate-300"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="newest">Newest</option>
              <option value="price_asc">Price ↑</option>
              <option value="price_desc">Price ↓</option>
              <option value="stock_desc">Stock ↓</option>
            </select>

            <button
              onClick={onApply}
              className="px-4 py-3 rounded-2xl bg-slate-900 text-white text-sm font-medium hover:opacity-90"
            >
              Apply
            </button>
          </div>
        </div>
      </div>

      {err && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-sm text-red-700">
          {err}
        </div>
      )}

      {loading ? (
        <div className="text-slate-600">Loading...</div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.items.map((x) => (
            <LaptopCard
              key={x._id}
              laptop={x}
              canAdd={isAuthed}
              onAddToCart={addToCart}
            />
          ))}
        </div>
      )}

      <div className="flex items-center justify-between">
        <button
          disabled={page <= 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-4 py-2 rounded-xl border border-slate-300 bg-white disabled:opacity-50"
        >
          Prev
        </button>

        <div className="text-sm text-slate-600">
          Page {data.page} / {data.totalPages}
        </div>

        <button
          disabled={page >= data.totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="px-4 py-2 rounded-xl border border-slate-300 bg-white disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}