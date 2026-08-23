import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import API from "../api/axios";
import {
  Package,
  ArrowRight,
} from "../icons";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);

        const response = await API.get("/api/orders/my");

        setOrders(response.data);
      } catch (err) {
        console.error("Orders error:", err);

        setError(
          err.response?.data?.message ||
            "Unable to load your orders."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <main className="orders-page">
        <div className="orders-status">
          <div className="loader"></div>
          <p>Loading your orders...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="orders-page">
        <div className="orders-status">
          <h2>Unable to load orders</h2>
          <p>{error}</p>
        </div>
      </main>
    );
  }

  if (orders.length === 0) {
    return (
      <main className="orders-page">

        <div className="orders-header">
          <p className="section-eyebrow">
            VENDERVERSE
          </p>

          <h1>My Orders</h1>

          <p>
            Track your purchases and view order details.
          </p>
        </div>

        <div className="orders-empty">

          <div className="orders-empty-icon">
            <Package size={48} />
          </div>

          <h2>No orders yet</h2>

          <p>
            Your completed orders will appear here.
          </p>

          <Link
            to="/products"
            className="orders-shop-button"
          >
            Start Shopping
            <ArrowRight size={18} />
          </Link>

        </div>

      </main>
    );
  }

  return (
    <main className="orders-page">

      <div className="orders-header">

        <p className="section-eyebrow">
          VENDERVERSE
        </p>

        <h1>My Orders</h1>

        <p>
          {orders.length}{" "}
          {orders.length === 1 ? "order" : "orders"}{" "}
          in your account.
        </p>

      </div>


      <section className="orders-list">

        {orders.map((order) => (

          <article
            className="order-card"
            key={order._id}
          >

            <div className="order-card-top">

              <div>
                <span>Order ID</span>

                <strong>
                  #{order._id.slice(-8).toUpperCase()}
                </strong>
              </div>

              <div className="order-date">
                {order.createdAt
                  ? new Date(
                      order.createdAt
                    ).toLocaleDateString("en-IN")
                  : ""}
              </div>

            </div>


            <div className="order-card-middle">

              <div>
                <span>Status</span>

                <strong
                  className={`order-status-badge ${
                    order.orderStatus?.toLowerCase()
                  }`}
                >
                  {order.orderStatus || "Processing"}
                </strong>
              </div>


              <div>
                <span>Payment</span>

                <strong
                  className="payment-status-badge"
                >
                  {order.paymentStatus || "Pending"}
                </strong>
              </div>


              <div>
                <span>Total</span>

                <strong className="order-total">
                  ₹
                  {Number(
                    order.totalPrice || 0
                  ).toLocaleString("en-IN")}
                </strong>
              </div>

            </div>


            <div className="order-card-bottom">

              <span>
                {order.orderItems?.length || 0}{" "}
                {order.orderItems?.length === 1
                  ? "item"
                  : "items"}
              </span>

              <Link
                to={`/orders/${order._id}`}
                className="order-details-button"
              >
                View Details
                <ArrowRight size={18} />
              </Link>

            </div>

          </article>

        ))}

      </section>

    </main>
  );
}

export default Orders;