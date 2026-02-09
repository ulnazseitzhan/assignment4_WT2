import React, { useEffect, useState } from "react";
import { api } from "../api/client";
import { useAuth } from "../auth/AuthContext";
import Input from "../components/Input";
import Button from "../components/Button";

const emptyForm = {
  name: "",
  brand: "",
  price: 0,
  stock: 0,
  imageUrl: "",
  description: ""
};

export default function AdminLaptops() {
  const { token } = useAuth();

  const [data, setData] = useState({ items: [] });
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState("");

  async function load() {
    setLoading(true);
    setErr("");

    try {
      const res = await api("/laptops?limit=50&sort=newest");
      setData(res);
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

  function onChange(key, val) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  function startEdit(laptop) {
    setEditingId(laptop._id);

    setForm({
      name: laptop.name,
      brand: laptop.brand,
      price: laptop.price,
      stock: laptop.stock,
      imageUrl: laptop.imageUrl || "",
      description: laptop.description || ""
    });
  }

  function cancelEdit() {
    setEditingId("");
    setForm(emptyForm);
  }

  async function createLaptop(e) {
    e.preventDefault();

    try {
      await api("/laptops", { method: "POST", token, body: form });
      cancelEdit();
      await load();
    } catch (e) {
      alert(e.message);
    }
  }

  async function updateLaptop(e) {
    e.preventDefault();

    try {
      await api(`/laptops/${editingId}`, { method: "PUT", token, body: form });
      cancelEdit();
      await load();
    } catch (e) {
      alert(e.message);
    }
  }

  async function deleteLaptop(id) {
    if (!confirm("Delete this laptop?")) return;

    try {
      await api(`/laptops/${id}`, { method: "DELETE", token });
      await load();
    } catch (e) {
      alert(e.message);
    }
  }

  return (
    <div className="grid gap-6">
      <div className="bg-white border border-slate-200 rounded-3xl p-6">
        <h2 className="text-xl font-bold">Admin: Laptops CRUD</h2>
        <p className="text-sm text-slate-600 mt-1">
          Create / Update / Delete laptops (adminOnly).
        </p>
      </div>

      {err && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-sm text-red-700">
          {err}
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="bg-white border border-slate-200 rounded-3xl p-6">
          <div className="font-semibold mb-4">
            {editingId ? "Edit Laptop" : "Create Laptop"}
          </div>

          <form
            className="grid gap-3"
            onSubmit={editingId ? updateLaptop : createLaptop}
          >
            <Input
              label="Name"
              placeholder="Laptop name"
              value={form.name}
              onChange={(e) => onChange("name", e.target.value)}
            />

            <Input
              label="Brand"
              placeholder="Laptop brand"
              value={form.brand}
              onChange={(e) => onChange("brand", e.target.value)}
            />

            <Input
              label="Price"
              type="number"
              value={form.price}
              onChange={(e) => onChange("price", Number(e.target.value))}
            />

            <Input
              label="Stock"
              type="number"
              value={form.stock}
              onChange={(e) => onChange("stock", Number(e.target.value))}
            />

            <Input
              label="Image URL (optional)"
              placeholder="https://..."
              value={form.imageUrl}
              onChange={(e) => onChange("imageUrl", e.target.value)}
            />

            <label className="grid gap-2">
              <div className="text-sm font-medium text-slate-700">
                Description
              </div>
              <textarea
                className="px-4 py-3 rounded-2xl border border-slate-300 outline-none focus:ring-2 focus:ring-slate-900 min-h-[120px]"
                placeholder="Laptop description"
                value={form.description}
                onChange={(e) => onChange("description", e.target.value)}
              />
            </label>

            <Button>{editingId ? "Update" : "Create"}</Button>

            {editingId && (
              <Button type="button" variant="secondary" onClick={cancelEdit}>
                Cancel
              </Button>
            )}
          </form>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-6">
          <div className="font-semibold mb-4">All laptops</div>

          {loading ? (
            <div className="text-slate-600">Loading...</div>
          ) : (
            <div className="grid gap-3">
              {data.items.map((x) => (
                <div
                  key={x._id}
                  className="border border-slate-200 rounded-2xl p-4 flex justify-between gap-4"
                >
                  <div>
                    <div className="text-sm text-slate-500">{x.brand}</div>
                    <div className="font-semibold">{x.name}</div>
                    <div className="text-sm text-slate-600 mt-1">
                      ${x.price} • stock {x.stock}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => startEdit(x)}
                      className="px-3 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-sm"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => deleteLaptop(x._id)}
                      className="px-3 py-2 rounded-xl bg-slate-900 text-white hover:opacity-90 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-4 text-xs text-slate-500">
            This page exists to satisfy CRUD requirements for multiple
            collections and admin authorization.
          </div>
        </div>
      </div>
    </div>
  );
}