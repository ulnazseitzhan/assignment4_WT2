const mongoose = require("mongoose");

const laptopSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    brand: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    description: { type: String }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Laptop", laptopSchema);
