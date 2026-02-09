const mongoose = require("mongoose");

const laptopSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    brand: { type: String, required: true, trim: true },

    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, default: 0, min: 0 },

    imageUrl: { type: String, default: "" },
    description: { type: String, default: "" }
  },
  { timestamps: true }
);

// Compound index for filtering/sorting
laptopSchema.index({ brand: 1, price: 1 });

// Text search index
laptopSchema.index({ name: "text", brand: "text", description: "text" });

module.exports = mongoose.model("Laptop", laptopSchema);
