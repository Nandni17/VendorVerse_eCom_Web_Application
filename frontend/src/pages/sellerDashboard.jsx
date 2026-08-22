import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import API from "../api/axios";

function SellerDashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================
  // FETCH SELLER DATA
  // =========================

  useEffect(() => {
    const fetchSellerData = async () => {
      try {
        setLoading(true);
        setError("");

        const [productsResponse, ordersResponse] =
          await Promise.all([
            API.get("/api/products/my"),
            API.get("/api/orders/seller"),
          ]);

        setProducts(productsResponse.data || []);
        setOrders(ordersResponse.data || []);
      } catch (err) {
        console.error(
          "Seller dashboard error:",
          err
        );

        setError(
          err.response?.data?.message ||
            err.response?.data?.error ||
            "Unable to load seller dashboard."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSellerData();
  }, []);

  // =========================
  // STATS
  // =========================

  const productCount = products.length;

  const orderCount = orders.length;

  const lowStockCount = products.filter(
    (product) =>
      Number(product.stock) <= 5
  ).length;

  const paidSales = orders
    .filter(
      (order) =>
        order.paymentStatus === "paid"
    )
    .reduce(
      (total, order) =>
        total + Number(order.totalPrice || 0),
      0
    );

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <main className="seller-dashboard">

        <div className="seller-products-status">

          <div className="loader"></div>

          <p>
            Loading seller dashboard...
          </p>

        </div>

      </main>
    );
  }

  // =========================
  // ERROR
  // =========================

  if (error) {
    return (
      <main className="seller-dashboard">

        <div className="seller-products-status error">

          <h2>
            Unable to load dashboard
          </h2>

          <p>
            {error}
          </p>

          <button
            type="button"
            className="seller-retry-button"
            onClick={() =>
              window.location.reload()
            }
          >
            Try Again
          </button>

        </div>

      </main>
    );
  }

  return (
    <main className="seller-dashboard">

      {/* =========================
          HEADER
      ========================= */}

      <section className="seller-dashboard-header">

        <div>

          <p className="section-eyebrow">
            VENDERVERSE SELLER
          </p>

          <h1>
            Seller Dashboard
          </h1>

          <p>
            Manage your products, inventory
            and orders from one place.
          </p>

        </div>

      </section>


      {/* =========================
          STATS
      ========================= */}

      <section className="seller-stats">

        {/* PRODUCTS */}

        <div className="seller-stat-card">

          <span>
            Products
          </span>

          <strong>
            {productCount}
          </strong>

        </div>


        {/* ORDERS */}

        <div className="seller-stat-card">

          <span>
            Orders
          </span>

          <strong>
            {orderCount}
          </strong>

        </div>


        {/* SALES */}

        <div className="seller-stat-card">

          <span>
            Paid Sales
          </span>

          <strong>
            ₹
            {paidSales.toLocaleString(
              "en-IN"
            )}
          </strong>

        </div>


        {/* LOW STOCK */}

        <div className="seller-stat-card">

          <span>
            Low Stock
          </span>

          <strong>
            {lowStockCount}
          </strong>

        </div>

      </section>


      {/* =========================
          QUICK ACTIONS
      ========================= */}

      <section className="seller-actions">

        {/* MY PRODUCTS */}

        <Link
          to="/seller/products"
          className="seller-action-card"
        >

          <span className="seller-action-icon">
            📦
          </span>

          <div>

            <h3>
              My Products
            </h3>

            <p>
              View and manage your products.
            </p>

          </div>

          <span>
            →
          </span>

        </Link>


        {/* ADD PRODUCT */}

        <Link
          to="/seller/products/add"
          className="seller-action-card"
        >

          <span className="seller-action-icon">
            ＋
          </span>

          <div>

            <h3>
              Add Product
            </h3>

            <p>
              Add a new product to VendorVerse.
            </p>

          </div>

          <span>
            →
          </span>

        </Link>


        {/* ORDERS */}

        <Link
          to="/seller/orders"
          className="seller-action-card"
        >

          <span className="seller-action-icon">
            🚚
          </span>

          <div>

            <h3>
              Orders
            </h3>

            <p>
              Manage customer orders and status.
            </p>

          </div>

          <span>
            →
          </span>

        </Link>

        {/* MESSAGES */}

<Link
  to="/conversations"
  className="seller-action-card seller-message-card"
>

  <span className="seller-action-icon">
    💬
  </span>

  <div>

    <h3>
      Messages
    </h3>

    <p>
      Chat with your buyers and manage conversations.
    </p>

  </div>

  <span>
    →
  </span>

</Link>

      </section>

    </main>
  );
}

export default SellerDashboard;