import React from "react";

export default function Input({ label, ...props }) {
  return (
    <label className="grid gap-2">
      {label && <div className="text-sm font-medium text-slate-700">{label}</div>}

      <input
        {...props}
        className={
          "px-4 py-3 rounded-2xl border border-slate-300 outline-none " +
          "focus:ring-2 focus:ring-slate-900 " +
          (props.className || "")
        }
      />
    </label>
  );
}