const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const paymentRoutes = require("./routes/paymentRoutes");

// Middleware
app.use(cors());
app.use("/api/payment/webhook", express.raw({ type: "application/json" }));
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("VendorVerse API is running");
});

// Routes
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);
const contactRoutes = require("./routes/contactRoutes");
app.use("/api/contact",contactRoutes);
const productRoutes = require("./routes/productRoutes");
app.use("/api/products", productRoutes);
const orderRoutes = require("./routes/orderRoutes");
app.use("/api/orders", orderRoutes);
app.use("/api/payment", paymentRoutes);
const heroBannerRoutes = require("./routes/heroBannerRoutes");
app.use("/api/hero-banners", heroBannerRoutes);
const adminRoutes = require("./routes/adminRoutes");
app.use("/api/admin",adminRoutes);

// Connect DB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});