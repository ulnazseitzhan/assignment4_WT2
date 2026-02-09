const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    laptopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Laptop",
      required: true
    },

    // snapshot data (so order stays correct even if laptop changes later)
    name: { type: String, required: true },
    brand: { type: String, required: true },

    priceAtPurchase: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 }
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    items: { type: [orderItemSchema], required: true },

    totalPrice: { type: Number, required: true, min: 0 },

    status: {
      type: String,
      enum: ["pending", "paid", "shipped", "cancelled"],
      default: "pending"
    }
  },
  { timestamps: true }
);

// Index: fast user order history
orderSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model("Order", orderSchema);