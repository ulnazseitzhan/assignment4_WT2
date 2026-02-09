const express = require("express");
const mongoose = require("mongoose");

const Cart = require("../models/Cart");
const Laptop = require("../models/Laptop");

const auth = require("../middleware/auth");

const router = express.Router();

// Helper: ensure cart exists
async function ensureCart(userId) {
  let cart = await Cart.findOne({ userId });
  if (!cart) cart = await Cart.create({ userId, items: [] });
  return cart;
}

// GET /cart
router.get("/", auth, async (req, res, next) => {
  try {
    const cart = await ensureCart(req.user.id);

    const populated = await Cart.findById(cart._id).populate("items.laptopId");
    res.json(populated);
  } catch (e) {
    next(e);
  }
});

// PATCH /cart/add/:laptopId
router.patch("/add/:laptopId", auth, async (req, res, next) => {
  try {
    const { laptopId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(laptopId)) {
      return res.status(400).json({ message: "Invalid laptopId" });
    }

    const laptop = await Laptop.findById(laptopId);
    if (!laptop) return res.status(404).json({ message: "Laptop not found" });

    await ensureCart(req.user.id);

    // If item exists -> increment quantity
    const incResult = await Cart.updateOne(
      { userId: req.user.id, "items.laptopId": laptopId },
      { $inc: { "items.$.quantity": 1 } }
    );

    // If not exists -> push
    if (incResult.modifiedCount === 0) {
      await Cart.updateOne(
        { userId: req.user.id },
        { $push: { items: { laptopId, quantity: 1 } } }
      );
    }

    const updated = await Cart.findOne({ userId: req.user.id }).populate("items.laptopId");
    res.json(updated);
  } catch (e) {
    next(e);
  }
});

// PATCH /cart/set/:laptopId  body: { quantity }
router.patch("/set/:laptopId", auth, async (req, res, next) => {
  try {
    const { laptopId } = req.params;
    const { quantity } = req.body;

    const qty = Number(quantity);
    if (!qty || qty < 1) {
      return res.status(400).json({ message: "Quantity must be >= 1" });
    }

    await ensureCart(req.user.id);

    const result = await Cart.updateOne(
      { userId: req.user.id, "items.laptopId": laptopId },
      { $set: { "items.$.quantity": qty } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    const updated = await Cart.findOne({ userId: req.user.id }).populate("items.laptopId");
    res.json(updated);
  } catch (e) {
    next(e);
  }
});

// DELETE /cart/remove/:laptopId
router.delete("/remove/:laptopId", auth, async (req, res, next) => {
  try {
    const { laptopId } = req.params;

    await ensureCart(req.user.id);

    await Cart.updateOne(
      { userId: req.user.id },
      { $pull: { items: { laptopId } } }
    );

    const updated = await Cart.findOne({ userId: req.user.id }).populate("items.laptopId");
    res.json(updated);
  } catch (e) {
    next(e);
  }
});

// DELETE /cart/clear
router.delete("/clear", auth, async (req, res, next) => {
  try {
    await ensureCart(req.user.id);

    await Cart.updateOne(
      { userId: req.user.id },
      { $set: { items: [] } }
    );

    const updated = await Cart.findOne({ userId: req.user.id }).populate("items.laptopId");
    res.json(updated);
  } catch (e) {
    next(e);
  }
});

module.exports = router;