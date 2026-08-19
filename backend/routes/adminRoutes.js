const express = require("express");

const {
  getDashboardStats,
  getUsers,
  getSellers,
  getProducts,
  getOrders,
  getPaymentOverview,
  deleteUser,
  deleteSeller,
  deleteProduct,
} = require("../controllers/adminController");

const {
  getContactMessages,
  updateContactMessageStatus,
  deleteContactMessage,
} = require("../controllers/contactController");

const {
  protect,
  authorizeRoles,
} = require("../middleware/authMiddleware");

const router = express.Router();


// =====================================================
// ADMIN DASHBOARD
// =====================================================

router.get(
  "/dashboard",
  protect,
  authorizeRoles("admin"),
  getDashboardStats
);


// =====================================================
// USERS
// =====================================================

router.get(
  "/users",
  protect,
  authorizeRoles("admin"),
  getUsers
);


// =====================================================
// SELLERS
// =====================================================

router.get(
  "/sellers",
  protect,
  authorizeRoles("admin"),
  getSellers
);


// =====================================================
// PRODUCTS
// =====================================================

router.get(
  "/products",
  protect,
  authorizeRoles("admin"),
  getProducts
);


// =====================================================
// ORDERS
// =====================================================

router.get(
  "/orders",
  protect,
  authorizeRoles("admin"),
  getOrders
);


// =====================================================
// PAYMENTS
// =====================================================

router.get(
  "/payments",
  protect,
  authorizeRoles("admin"),
  getPaymentOverview
);

// =====================================================
// DELETE ROUTES
// =====================================================

router.delete(
  "/users/:id",
  protect,
  authorizeRoles("admin"),
  deleteUser
);

router.delete(
  "/sellers/:id",
  protect,
  authorizeRoles("admin"),
  deleteSeller
);

router.delete(
  "/products/:id",
  protect,
  authorizeRoles("admin"),
  deleteProduct
);

// =====================================================
// CONTACT MESSAGES
// =====================================================

router.get(
  "/contacts",
  protect,
  authorizeRoles("admin"),
  getContactMessages
);

router.put(
  "/contacts/:id/status",
  protect,
  authorizeRoles("admin"),
  updateContactMessageStatus
);

router.delete(
  "/contacts/:id",
  protect,
  authorizeRoles("admin"),
  deleteContactMessage
);

module.exports = router;