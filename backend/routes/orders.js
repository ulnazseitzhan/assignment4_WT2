const express = require("express");
const mongoose = require("mongoose");

const Cart = require("../models/Cart");
const Laptop = require("../models/Laptop");
const Order = require("../models/Order");

const auth = require("../middleware/auth");
const adminOnly = require("../middleware/adminOnly");

const router = express.Router();

// ==========================
// USER: Checkout
// POST /orders/checkout
// ==========================
router.post("/checkout", auth, async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Load laptop details
    const laptopIds = cart.items.map((i) => i.laptopId);
    const laptops = await Laptop.find({ _id: { $in: laptopIds } });

    const laptopMap = new Map(laptops.map((l) => [String(l._id), l]));

    let total = 0;
    const orderItems = [];

    for (const item of cart.items) {
      const laptop = laptopMap.get(String(item.laptopId));

      if (!laptop) continue;

      // stock check
      if (laptop.stock < item.quantity) {
        return res.status(400).json({
          message: `Not enough stock for "${laptop.name}". Available: ${laptop.stock}`
        });
      }

      total += laptop.price * item.quantity;

      orderItems.push({
        laptopId: laptop._id,
        name: laptop.name,
        brand: laptop.brand,
        priceAtPurchase: laptop.price,
        quantity: item.quantity
      });
    }

    if (orderItems.length === 0) {
      return res.status(400).json({ message: "Cart contains invalid items" });
    }

    // Decrease stock using $inc (advanced update)
    for (const it of orderItems) {
      await Laptop.updateOne(
        { _id: it.laptopId },
        { $inc: { stock: -it.quantity } }
      );
    }

    // Create order
    const order = await Order.create({
      userId: req.user.id,
      items: orderItems,
      totalPrice: total,
      status: "pending"
    });

    // Clear cart using $set (advanced update)
    await Cart.updateOne({ userId: req.user.id }, { $set: { items: [] } });

    res.status(201).json(order);
  } catch (e) {
    next(e);
  }
});

// ==========================
// USER: My orders
// GET /orders/my
// ==========================
router.get("/my", auth, async (req, res, next) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (e) {
    next(e);
  }
});

// =====================================================
// ADMIN CRUD FOR ORDERS (to satisfy multi-collection CRUD)
// =====================================================

// GET /orders (ADMIN) - list all orders
router.get("/", auth, adminOnly, async (req, res, next) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate("userId", "username email role");

    res.json(orders);
  } catch (e) {
    next(e);
  }
});

// GET /orders/:id (ADMIN) - get one order
router.get("/:id", auth, adminOnly, async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "userId",
      "username email role"
    );

    if (!order) return res.status(404).json({ message: "Order not found" });

    res.json(order);
  } catch (e) {
    next(e);
  }
});

// PATCH /orders/:id/status (ADMIN) body: { status }
router.patch("/:id/status", auth, adminOnly, async (req, res, next) => {
  try {
    const { status } = req.body;

    const allowed = ["pending", "paid", "shipped", "cancelled"];
    if (!allowed.includes(status)) {
      return res.status(400).json({
        message: `Invalid status. Allowed: ${allowed.join(", ")}`
      });
    }

    // Advanced update: $set
    const updated = await Order.findByIdAndUpdate(
      req.params.id,
      { $set: { status } },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Order not found" });

    res.json(updated);
  } catch (e) {
    next(e);
  }
});

// DELETE /orders/:id (ADMIN)
router.delete("/:id", auth, adminOnly, async (req, res, next) => {
  try {
    const deleted = await Order.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Order not found" });

    res.json({ message: "Order deleted" });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
