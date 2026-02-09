require("dotenv").config();
const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const errorHandler = require("./utils/errorHandler");

// Routes
const authRoutes = require("./routes/auth");
const laptopRoutes = require("./routes/laptops");
const cartRoutes = require("./routes/cart");
const orderRoutes = require("./routes/orders");
const analyticsRoutes = require("./routes/analytics");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.send("Laptop Store API running");
});

// API routes
app.use("/auth", authRoutes);
app.use("/laptops", laptopRoutes);
app.use("/cart", cartRoutes);
app.use("/orders", orderRoutes);
app.use("/analytics", analyticsRoutes);

// Error handler (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connectDB(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  });
