const express = require("express");

const {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
  getAllOrders,
  getSellerOrders,
} = require("../controllers/orderController");

const {
  protect,
  authorizeRoles,
} = require("../middleware/authMiddleware");

const router = express.Router();


// ==========================================
// BUYER
// ==========================================

router.post(
  "/",
  protect,
  authorizeRoles("buyer"),
  createOrder
);

router.get(
  "/my",
  protect,
  authorizeRoles("buyer"),
  getMyOrders
);


// ==========================================
// SELLER
// ==========================================

router.get(
  "/seller",
  protect,
  authorizeRoles("seller"),
  getSellerOrders
);

router.put(
  "/:id/status",
  protect,
  authorizeRoles("seller"),
  updateOrderStatus
);


// ==========================================
// ADMIN
// ==========================================

router.get(
  "/",
  protect,
  authorizeRoles("admin"),
  getAllOrders
);


// ==========================================
// SHARED ORDER DETAILS
// BUYER / SELLER / ADMIN
// ==========================================

router.get(
  "/:id",
  protect,
  getOrderById
);


// ==========================================
// BUYER CANCELLATION
// ==========================================

router.put(
  "/:id/cancel",
  protect,
  authorizeRoles("buyer"),
  cancelOrder
);


module.exports = router;