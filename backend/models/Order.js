const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    // =========================
    // BUYER
    // =========================

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // =========================
    // SELLER
    // =========================

    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // =========================
    // PRODUCTS
    // =========================

    orderItems: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },

        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
      },
    ],

    // =========================
    // PRICE
    // =========================

    totalPrice: {
      type: Number,
      required: true,
    },

    // =========================
    // ORDER STATUS
    // =========================

    orderStatus: {
      type: String,
      enum: [
        "processing",
        "shipped",
        "delivered",
        "cancelled",
      ],
      default: "processing",
    },

    // =========================
    // PAYMENT
    // =========================
    
  paymentMethod: {
  type: String,
  enum: ["stripe", "cod"],
  default: "stripe",
},

    paymentInfo: {
      id: String,
      status: String,
    },

    paymentStatus: {
      type: String,
      enum: [
        "pending",
        "paid",
        "failed",
      ],
      default: "pending",
    },

    paidAt: {
      type: Date,
    },

    // =========================
    // SHIPPING TIMESTAMPS
    // =========================

    shippedAt: {
      type: Date,
    },

    deliveredAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Order",
  orderSchema
);