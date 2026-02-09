const express = require("express");
const Laptop = require("../models/Laptop");

const auth = require("../middleware/auth");
const adminOnly = require("../middleware/adminOnly");

const router = express.Router();

// GET /laptops?search=&brand=&minPrice=&maxPrice=&sort=price_asc&page=1&limit=12
router.get("/", async (req, res, next) => {
  try {
    const {
      search = "",
      brand = "",
      minPrice = "",
      maxPrice = "",
      sort = "newest",
      page = "1",
      limit = "12"
    } = req.query;

    const query = {};

    if (brand) query.brand = brand;

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (search) {
      query.$text = { $search: search };
    }

    const sortMap = {
      newest: { createdAt: -1 },
      price_asc: { price: 1 },
      price_desc: { price: -1 },
      stock_desc: { stock: -1 }
    };

    const sortObj = sortMap[sort] || sortMap.newest;

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(50, Math.max(1, Number(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [items, total] = await Promise.all([
      Laptop.find(query).sort(sortObj).skip(skip).limit(limitNum),
      Laptop.countDocuments(query)
    ]);

    res.json({
      items,
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum)
    });
  } catch (e) {
    next(e);
  }
});

// GET /laptops/:id
router.get("/:id", async (req, res, next) => {
  try {
    const laptop = await Laptop.findById(req.params.id);
    if (!laptop) return res.status(404).json({ message: "Laptop not found" });
    res.json(laptop);
  } catch (e) {
    next(e);
  }
});

// POST /laptops (ADMIN)
router.post("/", auth, adminOnly, async (req, res, next) => {
  try {
    const { name, brand, price, stock } = req.body;

    if (!name || !brand || price === undefined) {
      return res.status(400).json({ message: "name, brand, price are required" });
    }

    const laptop = await Laptop.create({
      name,
      brand,
      price,
      stock: stock ?? 0,
      imageUrl: req.body.imageUrl || "",
      description: req.body.description || ""
    });

    res.status(201).json(laptop);
  } catch (e) {
    next(e);
  }
});

// PUT /laptops/:id (ADMIN)
router.put("/:id", auth, adminOnly, async (req, res, next) => {
  try {
    const updated = await Laptop.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    });

    if (!updated) return res.status(404).json({ message: "Laptop not found" });

    res.json(updated);
  } catch (e) {
    next(e);
  }
});

// DELETE /laptops/:id (ADMIN)
router.delete("/:id", auth, adminOnly, async (req, res, next) => {
  try {
    const deleted = await Laptop.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Laptop not found" });

    res.json({ message: "Laptop deleted" });
  } catch (e) {
    next(e);
  }
});

module.exports = router;