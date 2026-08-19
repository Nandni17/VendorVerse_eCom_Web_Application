const express = require("express");
const router = express.Router();

const { createCheckoutSession} = require("../controllers/paymentController");
const { stripeWebhook } = require("../controllers/webhookController");
const { protect } = require("../middleware/authMiddleware");

// ✅ Checkout (protected)
router.post("/create-checkout-session", protect, createCheckoutSession);

// ✅ Webhook (NO protect)
router.post("/webhook", stripeWebhook);

module.exports = router;