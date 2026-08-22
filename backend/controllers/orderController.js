const Order = require("../models/Order");
const Product = require("../models/Product");
const mongoose = require("mongoose");

exports.createOrder = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
   const { orderItems, paymentMethod } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: "No order items" });
    }

    if (!["stripe", "cod"].includes(paymentMethod)) {
  return res.status(400).json({
    message: "Invalid payment method",
  });
}

    // ✅ Fetch all products
    const productIds = orderItems.map(i => i.product);

    const products = await Product.find({
      _id: { $in: productIds }
    }).session(session);

    if (products.length !== orderItems.length) {
      throw new Error("Some products not found");
    }

    // ✅ Map products
    const productMap = {};
    products.forEach(p => {
      productMap[p._id] = p;
    });

    // ✅ GROUP by seller
    const sellerMap = {}; // { sellerId: { items: [], totalPrice: 0 } }

    for (const item of orderItems) {
      const product = productMap[item.product];

      if (!product) throw new Error("Product not found");

      if (product.stock < item.quantity) {
        throw new Error(`Not enough stock for ${product.name}`);
      }

      const sellerId = product.seller.toString();

      if (!sellerMap[sellerId]) {
        sellerMap[sellerId] = {
          items: [],
          totalPrice: 0
        };
      }

      sellerMap[sellerId].items.push({
        product: product._id,
        quantity: item.quantity
      });

      sellerMap[sellerId].totalPrice += product.price * item.quantity;

      // 📦 reduce stock
      product.stock -= item.quantity;
      await product.save({ session });
    }

    // ✅ CREATE MULTIPLE ORDERS
    const createdOrders = [];

    for (const sellerId in sellerMap) {
      const data = sellerMap[sellerId];

      const order = await Order.create([{
  user: req.user._id,
  seller: sellerId,
  orderItems: data.items,
  totalPrice: data.totalPrice,
  orderStatus: "processing",
  paymentMethod,
  paymentStatus: "pending",
}], { session });

      createdOrders.push(order[0]);
    }

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      message: "Orders created successfully",
      orders: createdOrders
    });

  } catch (err) {
    await session.abortTransaction();
    session.endSession();

    return res.status(500).json({ error: err.message });
  }
};

// 🟢 GET MY ORDERS (Buyer)
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
.populate(
  "orderItems.product",
  "name price image category"
);

    return res.json(orders);

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// 🟢 GET ALL ORDERS (Admin)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("seller", "name email")
      .populate("orderItems.product", "name price");

    return res.json(orders);

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// 🟢 GET ORDER BY ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
  .populate(
    "orderItems.product",
    "name price image category"
  );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // ✅ Buyer check
    if (
      req.user.role === "buyer" && req.user.role !== "admin" &&
      order.user.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // ✅ Seller check (safe)
    if (
      req.user.role === "seller" &&
      (!order.seller || order.seller.toString() !== req.user._id.toString())
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    return res.json(order);

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// 🟢 GET SELLER ORDERS
exports.getSellerOrders = async (req, res) => {
  try {
    const orders = await Order.find({ seller: req.user._id })
      .populate("user", "name email")
      .populate("orderItems.product", "name price");

    return res.json(orders);

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// ==========================================
// UPDATE ORDER STATUS
// SELLER ONLY
// ==========================================

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status: newStatus } = req.body;

    if (!newStatus) {
      return res.status(400).json({
        message: "Status is required",
      });
    }

    const validStatuses = [
      "processing",
      "shipped",
      "delivered",
    ];

    if (!validStatuses.includes(newStatus)) {
      return res.status(400).json({
        message: "Invalid status",
      });
    }

    const order = await Order.findById(
      req.params.id
    );

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    // Seller ownership
    if (
      req.user.role === "seller" &&
      order.seller.toString() !==
        req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "Not your order",
      });
    }

    const currentStatus =
      order.orderStatus;

    const allowedTransitions = {
      processing: ["shipped"],
      shipped: ["delivered"],
      delivered: [],
      cancelled: [],
    };

    if (
      !allowedTransitions[currentStatus].includes(
        newStatus
      )
    ) {
      return res.status(400).json({
        message:
          `Cannot change status from ` +
          `${currentStatus} to ${newStatus}`,
      });
    }

    // =========================
    // TIMESTAMPS
    // =========================

    if (
      newStatus === "shipped" &&
      !order.shippedAt
    ) {
      order.shippedAt = new Date();
    }

    if (
      newStatus === "delivered" &&
      !order.deliveredAt
    ) {
      order.deliveredAt = new Date();
    }

    order.orderStatus = newStatus;

    await order.save();

    return res.json(order);

  } catch (err) {
    console.error(
      "Update order status error:",
      err
    );

    return res.status(500).json({
      error: err.message,
    });
  }
};

// 🟡 CANCEL ORDER (Buyer ONLY)
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(
      req.params.id
    );

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    // Only the buyer who owns the order
    if (
      order.user.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    // Only processing orders can be cancelled
    if (
      order.orderStatus !== "processing"
    ) {
      return res.status(400).json({
        message:
          "Only processing orders can be cancelled",
      });
    }

    order.orderStatus = "cancelled";

    await order.save();

    return res.json({
      message:
        "Order cancelled successfully",
      order,
    });

  } catch (err) {
    return res.status(500).json({
      error: err.message,
    });
  }
};