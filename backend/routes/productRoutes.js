const express = require("express");

const {
  createProduct,
  getMyProducts,
  updateProduct,
  deleteProduct,
  getAllProducts,
  getSingleProduct,
} = require("../controllers/productController");

const {
  protect,
  authorizeRoles,
} = require("../middleware/authMiddleware");

const router = express.Router();


// =====================================
// PUBLIC
// =====================================

router.get("/", getAllProducts);


// =====================================
// SELLER ONLY
// =====================================

router.get(
  "/my",
  protect,
  authorizeRoles("seller"),
  getMyProducts
);

router.post(
  "/",
  protect,
  authorizeRoles("seller"),
  createProduct
);

router.put(
  "/:id",
  protect,
  authorizeRoles("seller"),
  updateProduct
);

router.delete(
  "/:id",
  protect,
  authorizeRoles("seller"),
  deleteProduct
);


// =====================================
// SINGLE PRODUCT
// =====================================

router.get(
  "/:id",
  getSingleProduct
);


module.exports = router;