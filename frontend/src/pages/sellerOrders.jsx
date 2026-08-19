import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import API from "../api/axios";

function SellerOrders() {
  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [updatingOrderId, setUpdatingOrderId] =
    useState(null);

  // =========================
  // FETCH SELLER ORDERS
  // =========================

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get(
        "/api/orders/seller"
      );

      setOrders(response.data);
    } catch (err) {
      console.error(
        "Seller orders error:",
        err
      );

      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Unable to load seller orders."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // =========================
  // UPDATE STATUS
  // =========================

  const handleStatusChange = async (
    orderId,
    newStatus
  ) => {
    try {
      setUpdatingOrderId(orderId);
      setError("");

      const response = await API.put(
        `/orders/${orderId}/status`,
        {
          status: newStatus,
        }
      );

      // Update only the changed order
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId
            ? response.data
            : order
        )
      );
    } catch (err) {
      console.error(
        "Update order status error:",
        err
      );

      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Unable to update order status."
      );
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // =========================
  // GET NEXT STATUS OPTIONS
  // =========================

  const getStatusOptions = (status) => {
    switch (status) {
      case "processing":
        return ["shipped"];

      case "shipped":
        return ["delivered"];

      default:
        return [];
    }
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <main className="seller-orders-page">

        <div className="seller-orders-status">

          <div className="loader"></div>

          <p>
            Loading your orders...
          </p>

        </div>

      </main>
    );
  }

  return (
    <main className="seller-orders-page">

      {/* =========================
          HEADER
      ========================= */}

      <section className="seller-orders-header">

        <div>

          <Link
            to="/seller"
            className="seller-orders-back"
          >
            ← Seller Dashboard
          </Link>

          <p className="section-eyebrow">
            SELLER CENTER
          </p>

          <h1>
            Seller Orders
          </h1>

          <p>
            Manage customer orders and update
            their delivery status.
          </p>

        </div>

        <div className="seller-orders-count">
          {orders.length}{" "}
          {orders.length === 1
            ? "order"
            : "orders"}
        </div>

      </section>


      {/* =========================
          ERROR
      ========================= */}

      {error && (
        <div className="seller-orders-error">
          {error}
        </div>
      )}


      {/* =========================
          EMPTY
      ========================= */}

      {orders.length === 0 ? (

        <section className="seller-orders-empty">

          <div className="seller-orders-empty-icon">
            📦
          </div>

          <h2>
            No orders yet
          </h2>

          <p>
            Orders containing your products
            will appear here.
          </p>

          <Link
            to="/seller/products"
            className="seller-orders-button"
          >
            Manage Products →
          </Link>

        </section>

      ) : (

        /* =========================
           ORDERS LIST
        ========================= */

        <section className="seller-orders-list">

          {orders.map((order) => {

            const status =
              order.orderStatus ||
              "processing";

            const nextStatuses =
              getStatusOptions(status);

            return (
              <article
                className="seller-order-card"
                key={order._id}
              >

                {/* =====================
                    TOP
                ===================== */}

                <div className="seller-order-top">

                  <div>

                    <span className="seller-order-label">
                      Order ID
                    </span>

                    <strong>
                      #
                      {order._id
                        .slice(-8)
                        .toUpperCase()}
                    </strong>

                  </div>


                  <div className="seller-order-date">

                    {order.createdAt
                      ? new Date(
                          order.createdAt
                        ).toLocaleDateString(
                          "en-IN",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          }
                        )
                      : ""}

                  </div>

                </div>


                {/* =====================
                    CUSTOMER + PAYMENT
                ===================== */}

                <div className="seller-order-meta">

                  <div className="seller-order-meta-item">

                    <span>
                      Customer
                    </span>

                    <strong>
                      {order.user?.name ||
                        "Customer"}
                    </strong>

                    {order.user?.email && (
                      <small>
                        {order.user.email}
                      </small>
                    )}

                  </div>


                  <div className="seller-order-meta-item">

                    <span>
                      Payment
                    </span>

                    <strong
                      className="seller-payment-paid"
                    >
                      {order.paymentStatus ||
                        "pending"}
                    </strong>

                  </div>


                  <div className="seller-order-meta-item">

                    <span>
                      Total
                    </span>

                    <strong className="seller-order-total">
                      ₹
                      {Number(
                        order.totalPrice || 0
                      ).toLocaleString(
                        "en-IN"
                      )}
                    </strong>

                  </div>

                </div>


                {/* =====================
                    PRODUCTS
                ===================== */}

                <div className="seller-order-products">

                  <h3>
                    Products
                  </h3>

                  {order.orderItems?.map(
                    (item) => (

                      <div
                        className="seller-order-product"
                        key={
                          item._id ||
                          item.product?._id
                        }
                      >

                        <div className="seller-order-product-image">

                          {item.product?.image ? (
                            <img
                              src={
                                item.product.image
                              }
                              alt={
                                item.product.name ||
                                "Product"
                              }
                            />
                          ) : (
                            <span>
                              📦
                            </span>
                          )}

                        </div>


                        <div className="seller-order-product-info">

                          <strong>
                            {item.product?.name ||
                              "Product"}
                          </strong>

                          <span>
                            Quantity:{" "}
                            {item.quantity}
                          </span>

                        </div>


                        <strong className="seller-order-product-price">

                          ₹
                          {(
                            Number(
                              item.product?.price ||
                                0
                            ) *
                            Number(
                              item.quantity || 0
                            )
                          ).toLocaleString(
                            "en-IN"
                          )}

                        </strong>

                      </div>

                    )
                  )}

                </div>


                {/* =====================
                    STATUS
                ===================== */}

                <div className="seller-order-footer">

                  <div>

                    <span className="seller-order-label">
                      Current Status
                    </span>

                    <span
                      className={`seller-order-status ${status}`}
                    >
                      {status}
                    </span>

                  </div>


                  <div className="seller-order-actions">

                    {nextStatuses.length > 0 ? (

                      <select
                        value=""
                        onChange={(e) => {
                          if (
                            e.target.value
                          ) {
                            handleStatusChange(
                              order._id,
                              e.target.value
                            );
                          }
                        }}
                        disabled={
                          updatingOrderId ===
                          order._id
                        }
                        className="seller-status-select"
                      >

                        <option value="">
                          {updatingOrderId ===
                          order._id
                            ? "Updating..."
                            : "Update Status"}
                        </option>

                        {nextStatuses.map(
                          (nextStatus) => (
                            <option
                              key={nextStatus}
                              value={nextStatus}
                            >
                              Mark as{" "}
                              {nextStatus}
                            </option>
                          )
                        )}

                      </select>

                    ) : (

                      <span className="seller-status-complete">
                        {status ===
                        "delivered"
                          ? "✓ Order Delivered"
                          : "Order Closed"}
                      </span>

                    )}

                  </div>

                </div>

              </article>
            );
          })}

        </section>

      )}

    </main>
  );
}

export default SellerOrders;