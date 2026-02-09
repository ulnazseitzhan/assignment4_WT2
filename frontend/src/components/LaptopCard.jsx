import React from "react";

export default function LaptopCard({ laptop, onAddToCart, canAdd }) {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col">
      <div className="text-sm text-slate-500">{laptop.brand}</div>

      <div className="mt-1 font-semibold text-lg">{laptop.name}</div>

      <div className="mt-3 text-2xl font-bold">${laptop.price}</div>

      <div className="mt-2 text-sm text-slate-600">Stock: {laptop.stock}</div>

      {laptop.description && (
        <div className="mt-3 text-sm text-slate-600 line-clamp-3">
          {laptop.description}
        </div>
      )}

      <div className="mt-5">
        {canAdd ? (
          <button
            disabled={laptop.stock <= 0}
            onClick={() => onAddToCart(laptop._id)}
            className="w-full px-4 py-3 rounded-2xl bg-slate-900 text-white text-sm font-medium hover:opacity-90 disabled:opacity-50"
          >
            {laptop.stock <= 0 ? "Out of stock" : "Add to cart"}
          </button>
        ) : (
          <div className="text-sm text-slate-500">Login to add items to cart.</div>
        )}
      </div>
    </div>
  );
}