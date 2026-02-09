const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const Cart = require("../models/Cart");

const router = express.Router();

function makeToken(user) {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

// POST /auth/register
router.post("/register", async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "username, email, password are required" });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(409).json({ message: "Email already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email: email.toLowerCase(),
      password: hashed,
      role: "user"
    });

    // Create cart automatically
    await Cart.create({ userId: user._id, items: [] });

    const token = makeToken(user);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (e) {
    next(e);
  }
});

// POST /auth/login
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const token = makeToken(user);

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
