const Review = require("../models/Review");
const Product = require("../models/Product");
const Order = require("../models/Order");

// ==========================================
// CREATE REVIEW
// ==========================================

exports.createReview = async (req, res) => {
  try {
    const { productId } = req.params;
    const { rating, comment } = req.body;

    // =========================
    // VALIDATE RATING
    // =========================

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        message: "Rating must be between 1 and 5",
      });
    }

    if (!comment || !comment.trim()) {
      return res.status(400).json({
        message: "Review comment is required",
      });
    }

    // =========================
    // CHECK PRODUCT
    // =========================

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    // =========================
    // CHECK PURCHASE + DELIVERY
    // =========================

    const deliveredOrder = await Order.findOne({
      user: req.user._id,
      orderStatus: "delivered",
      "orderItems.product": productId,
    });

    if (!deliveredOrder) {
      return res.status(403).json({
        message:
          "You can review this product only after purchasing and receiving it.",
      });
    }

    // =========================
    // CHECK EXISTING REVIEW
    // =========================

    const existingReview = await Review.findOne({
      product: productId,
      user: req.user._id,
    });

    if (existingReview) {
      return res.status(400).json({
        message: "You have already reviewed this product",
      });
    }

    // =========================
    // CREATE REVIEW
    // =========================

    const review = await Review.create({
      product: productId,
      user: req.user._id,
      rating: Number(rating),
      comment: comment.trim(),
      verifiedPurchase: true,
    });

    // =========================
    // UPDATE PRODUCT RATING
    // =========================

    const reviews = await Review.find({
      product: productId,
    });

    const totalReviews = reviews.length;

    const totalRating = reviews.reduce(
      (sum, review) => sum + review.rating,
      0
    );

    product.rating =
      totalRating / totalReviews;

    product.numReviews = totalReviews;

    await product.save();

    return res.status(201).json({
      message: "Review added successfully",
      review,
    });
  } catch (err) {
    console.error(
      "Create review error:",
      err
    );

    return res.status(500).json({
      message: "Unable to create review",
      error: err.message,
    });
  }
};

// ==========================================
// GET PRODUCT REVIEWS
// ==========================================

exports.getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await Review.find({
      product: productId,
    })
      .populate("user", "name profileImage")
      .sort({ createdAt: -1 });

    return res.json(reviews);
  } catch (err) {
    console.error(
      "Get reviews error:",
      err
    );

    return res.status(500).json({
      message: "Unable to load reviews",
      error: err.message,
    });
  }
};

// ==========================================
// UPDATE REVIEW
// ==========================================

exports.updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;

    // =========================
    // VALIDATE RATING
    // =========================

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        message: "Rating must be between 1 and 5",
      });
    }

    // =========================
    // VALIDATE COMMENT
    // =========================

    if (!comment || !comment.trim()) {
      return res.status(400).json({
        message: "Review comment is required",
      });
    }

    // =========================
    // FIND REVIEW
    // =========================

    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({
        message: "Review not found",
      });
    }

    // =========================
    // CHECK OWNERSHIP
    // =========================

    if (
      review.user.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "You can only edit your own review",
      });
    }

    // =========================
    // UPDATE
    // =========================

    review.rating = Number(rating);
    review.comment = comment.trim();

    await review.save();

    // =========================
    // RECALCULATE PRODUCT RATING
    // =========================

    const reviews = await Review.find({
      product: review.product,
    });

    const totalReviews = reviews.length;

    const totalRating = reviews.reduce(
      (sum, item) => sum + item.rating,
      0
    );

    const product = await Product.findById(
      review.product
    );

    if (product) {
      product.rating =
        totalReviews > 0
          ? totalRating / totalReviews
          : 0;

      product.numReviews = totalReviews;

      await product.save();
    }

    return res.json({
      message: "Review updated successfully",
      review,
    });
  } catch (err) {
    console.error(
      "Update review error:",
      err
    );

    return res.status(500).json({
      message: "Unable to update review",
      error: err.message,
    });
  }
};

// ==========================================
// DELETE REVIEW
// ==========================================

exports.deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    // =========================
    // FIND REVIEW
    // =========================

    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({
        message: "Review not found",
      });
    }

    // =========================
    // CHECK OWNERSHIP
    // =========================

    if (
      review.user.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "You can only delete your own review",
      });
    }

    const productId = review.product;

    // =========================
    // DELETE REVIEW
    // =========================

    await Review.findByIdAndDelete(reviewId);

    // =========================
    // RECALCULATE PRODUCT RATING
    // =========================

    const reviews = await Review.find({
      product: productId,
    });

    const totalReviews = reviews.length;

    const totalRating = reviews.reduce(
      (sum, item) => sum + item.rating,
      0
    );

    const product = await Product.findById(
      productId
    );

    if (product) {
      product.rating =
        totalReviews > 0
          ? totalRating / totalReviews
          : 0;

      product.numReviews = totalReviews;

      await product.save();
    }

    return res.json({
      message: "Review deleted successfully",
    });
  } catch (err) {
    console.error(
      "Delete review error:",
      err
    );

    return res.status(500).json({
      message: "Unable to delete review",
      error: err.message,
    });
  }
};