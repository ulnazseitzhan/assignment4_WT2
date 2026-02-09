const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema(
  {
    laptopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Laptop",
      required: true
    },
    quantity: { type: Number, default: 1, min: 1 }
  },
  { _id: false }
);

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    items: { type: [cartItemSchema], default: [] }
  },
  { timestamps: true }
);

// Indexes (optimization)
cartSchema.index({ userId: 1 }, { unique: true });
cartSchema.index({ userId: 1, "items.laptopId": 1 });

module.exports = mongoose.model("Cart", cartSchema);
