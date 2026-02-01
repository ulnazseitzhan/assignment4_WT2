require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const laptopRoutes = require("./routes/laptops");
const authRoutes = require("./routes/auth");
const cartRoutes = require("./routes/cart");

const app = express();

/* Middleware */
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

/* Routes */
app.use("/laptops", laptopRoutes);
app.use("/auth", authRoutes);
app.use("/cart", cartRoutes);

/* Test */
app.get("/", (req, res) => {
  res.send("Laptop Store API is running");
});

/* DB */
mongoose
  .connect("mongodb://127.0.0.1:27017/laptopDB")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

app.listen(3000, () =>
  console.log("Server running on http://localhost:3000")
);
