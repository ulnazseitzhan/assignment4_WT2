const express = require("express");
const mongoose = require("mongoose");

const Order = require("../models/Order");
const Cart = require("../models/Cart");

const auth = require("../middleware/auth");
const adminOnly = require("../middleware/adminOnly");

const router = express.Router();

// GET /analytics/top-brands (ADMIN ONLY)
router.get("/top-brands", auth, adminOnly, async (req, res, next) => {
  try {
    const result = await Order.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.brand",
          ordersCount: { $sum: 1 },
          unitsSold: { $sum: "$items.quantity" },
          revenue: {
            $sum: { $multiply: ["$items.priceAtPurchase", "$items.quantity"] }
          }
        }
      },
      { $sort: { revenue: -1 } },
      { $limit: 10 },
      {
        $project: {
          _id: 0,
          brand: "$_id",
          ordersCount: 1,
          unitsSold: 1,
          revenue: 1
        }
      }
    ]);

    res.json(result);
  } catch (e) {
    next(e);
  }
});

// GET /analytics/cart-total (USER)
router.get("/cart-total", auth, async (req, res, next) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    const result = await Cart.aggregate([
      { $match: { userId } },
      { $unwind: "$items" },
      {
        $lookup: {
          from: "laptops",
          localField: "items.laptopId",
          foreignField: "_id",
          as: "laptop"
        }
      },
      { $unwind: "$laptop" },
      {
        $addFields: {
          lineTotal: { $multiply: ["$items.quantity", "$laptop.price"] }
        }
      },
      {
        $group: {
          _id: "$userId",
          total: { $sum: "$lineTotal" },
          itemsCount: { $sum: "$items.quantity" }
        }
      },
      {
        $project: {
          _id: 0,
          total: 1,
          itemsCount: 1
        }
      }
    ]);

    res.json(result[0] || { total: 0, itemsCount: 0 });
  } catch (e) {
    next(e);
  }
});

module.exports = router;