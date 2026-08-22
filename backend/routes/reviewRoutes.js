const express = require("express");

const {
  createReview,
  getProductReviews,
  updateReview,
  deleteReview,
} = require("../controllers/reviewController");

const {
  protect,
} = require("../middleware/authMiddleware");

const router = express.Router();

// ==========================================
// GET PRODUCT REVIEWS
// ==========================================

router.get(
  "/product/:productId",
  getProductReviews
);

// ==========================================
// CREATE REVIEW
// ==========================================

router.post(
  "/product/:productId",
  protect,
  createReview
);

// ==========================================
// UPDATE REVIEW
// ==========================================

router.put(
  "/:reviewId",
  protect,
  updateReview
);

// ==========================================
// DELETE REVIEW
// ==========================================

router.delete(
  "/:reviewId",
  protect,
  deleteReview
);

module.exports = router;