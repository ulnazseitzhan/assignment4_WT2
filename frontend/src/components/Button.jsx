import React from "react";

export default function Button({ variant = "primary", className = "", ...props }) {
  const base =
    "px-4 py-3 rounded-2xl text-sm font-medium transition disabled:opacity-50";

  const styles = {
    primary: "bg-slate-900 text-white hover:opacity-90",
    secondary: "bg-white border border-slate-300 hover:bg-slate-50 text-slate-800"
  };

  return <button {...props} className={`${base} ${styles[variant]} ${className}`} />;
}