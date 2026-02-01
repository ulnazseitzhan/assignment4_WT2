const router = require("express").Router();
const Cart = require("../models/Cart");
const { auth } = require("../middleware/auth");

/* ADD TO CART */
router.post("/add/:id", auth, async (req, res) => {
  let cart = await Cart.findOne({ userId: req.user.id });

  if (!cart) {
    cart = new Cart({ userId: req.user.id, items: [] });
  }

  cart.items.push({ laptopId: req.params.id });
  await cart.save();

  res.json(cart);
});

/* GET USER CART */
router.get("/", auth, async (req, res) => {
  const cart = await Cart.findOne({ userId: req.user.id })
    .populate("items.laptopId");

  res.json(cart || { items: [] });
});

module.exports = router;