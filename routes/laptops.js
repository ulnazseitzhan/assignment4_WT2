const router = require("express").Router();
const Laptop = require("../models/Laptop");
const { auth, adminOnly } = require("../middleware/auth");

/* READ ALL (public) */
router.get("/", async (req, res) => {
  res.json(await Laptop.find());
});

/* CREATE(admin only)*/
router.post("/", auth, adminOnly, async (req, res) => {
  const laptop = new Laptop(req.body);
  await laptop.save();
  res.status(201).json(laptop);
});

/* UPDATE(admin only)*/
router.put("/:id", auth, adminOnly, async (req, res) => {
  res.json(
    await Laptop.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    })
  );
});

/* DELETE(admin only)*/
router.delete("/:id", auth, adminOnly, async (req, res) => {
  await Laptop.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

module.exports = router;
