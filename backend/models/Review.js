const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    // =========================
    // PRODUCT
    // =========================

    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    // =========================
    // BUYER
    // =========================

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

     // =========================
    // VERIFIED PURCHASE
    // =========================

    verifiedPurchase: {
      type: Boolean,
      default: false,
    },

    // =========================
    // RATING
    // =========================

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    // =========================
    // COMMENT
    // =========================

    comment: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// One user can review a product only once
reviewSchema.index(
  { product: 1, user: 1 },
  { unique: true }
);

module.exports = mongoose.model(
  "Review",
  reviewSchema
);