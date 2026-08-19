const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");

// =====================================================
// ADMIN DASHBOARD OVERVIEW
// =====================================================

exports.getDashboardStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalSellers,
      totalProducts,
      totalOrders,
      paidOrders,
      pendingOrders,
    ] = await Promise.all([
      User.countDocuments({
        role: "buyer",
      }),

      User.countDocuments({
        role: "seller",
      }),

      Product.countDocuments(),

      Order.countDocuments(),

      Order.countDocuments({
        paymentStatus: "paid",
      }),

      Order.countDocuments({
        orderStatus: "processing",
      }),
    ]);

    // Total revenue from paid orders
    const revenueResult = await Order.aggregate([
      {
        $match: {
          paymentStatus: "paid",
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: "$totalPrice",
          },
        },
      },
    ]);

    const totalRevenue =
      revenueResult.length > 0
        ? revenueResult[0].totalRevenue
        : 0;

    res.json({
      totalUsers,
      totalSellers,
      totalProducts,
      totalOrders,
      paidOrders,
      pendingOrders,
      totalRevenue,
    });

  } catch (err) {
    console.error(
      "Admin dashboard error:",
      err
    );

    res.status(500).json({
      message:
        "Unable to load admin dashboard",
      error: err.message,
    });
  }
};


// =====================================================
// GET ALL BUYERS
// =====================================================

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({
      role: "buyer",
    })
      .select("-password")
      .sort({
        createdAt: -1,
      });

    res.json(users);

  } catch (err) {
    res.status(500).json({
      message: "Unable to load users",
      error: err.message,
    });
  }
};


// =====================================================
// GET ALL SELLERS
// =====================================================

exports.getSellers = async (req, res) => {
  try {
    const sellers = await User.find({
      role: "seller",
    })
      .select("-password")
      .sort({
        createdAt: -1,
      });

    res.json(sellers);

  } catch (err) {
    res.status(500).json({
      message: "Unable to load sellers",
      error: err.message,
    });
  }
};


// =====================================================
// GET ALL PRODUCTS
// =====================================================

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate(
        "seller",
        "name email"
      )
      .sort({
        createdAt: -1,
      });

    res.json(products);

  } catch (err) {
    res.status(500).json({
      message:
        "Unable to load products",
      error: err.message,
    });
  }
};


// =====================================================
// GET ALL ORDERS
// =====================================================

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate(
        "user",
        "name email"
      )
      .populate(
        "seller",
        "name email"
      )
      .populate(
        "orderItems.product",
        "name price image category"
      )
      .sort({
        createdAt: -1,
      });

    res.json(orders);

  } catch (err) {
    res.status(500).json({
      message:
        "Unable to load orders",
      error: err.message,
    });
  }
};


// =====================================================
// PAYMENT OVERVIEW
// =====================================================

exports.getPaymentOverview = async (
  req,
  res
) => {
  try {
    const [
      paidOrders,
      pendingPayments,
      failedPayments,
    ] = await Promise.all([
      Order.countDocuments({
        paymentStatus: "paid",
      }),

      Order.countDocuments({
        paymentStatus: "pending",
      }),

      Order.countDocuments({
        paymentStatus: "failed",
      }),
    ]);

    const revenueResult =
      await Order.aggregate([
        {
          $match: {
            paymentStatus: "paid",
          },
        },

        {
          $group: {
            _id: null,

            totalRevenue: {
              $sum: "$totalPrice",
            },
          },
        },
      ]);

    const totalRevenue =
      revenueResult.length > 0
        ? revenueResult[0].totalRevenue
        : 0;

    res.json({
      paidOrders,
      pendingPayments,
      failedPayments,
      totalRevenue,
    });

  } catch (err) {
    res.status(500).json({
      message:
        "Unable to load payment overview",
      error: err.message,
    });
  }
};

// =====================================================
// DELETE CUSTOMER
// =====================================================

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findOne({
      _id: req.params.id,
      role: "buyer",
    });

    if (!user) {
      return res.status(404).json({
        message: "Customer not found",
      });
    }

    await user.deleteOne();

    res.json({
      message: "Customer deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: "Unable to delete customer",
      error: err.message,
    });
  }
};

// =====================================================
// DELETE SELLER
// =====================================================

exports.deleteSeller = async (req, res) => {
  try {
    const seller = await User.findOne({
      _id: req.params.id,
      role: "seller",
    });

    if (!seller) {
      return res.status(404).json({
        message: "Seller not found",
      });
    }

    await Product.deleteMany({
      seller: seller._id,
    });

    await seller.deleteOne();

    res.json({
      message:
        "Seller and associated products deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: "Unable to delete seller",
      error: err.message,
    });
  }
};

// =====================================================
// DELETE PRODUCT
// =====================================================

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(
      req.params.id
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    await product.deleteOne();

    res.json({
      message: "Product deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: "Unable to delete product",
      error: err.message,
    });
  }
};