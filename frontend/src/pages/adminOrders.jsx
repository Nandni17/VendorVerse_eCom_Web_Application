import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import API from "../api/axios";

function AdminOrders() {
  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await API.get(
          "/api/admin/orders"
        );

        setOrders(response.data || []);
      } catch (err) {
        console.error(
          "Admin orders error:",
          err
        );

        setError(
          err.response?.data?.message ||
            "Unable to load orders."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <main className="admin-page">
        <div className="admin-status">
          <div className="loader"></div>
          <p>Loading orders...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="admin-page">

      <section className="admin-header">

        <div>

          <Link
            to="/admin"
            className="admin-back-link"
          >
            ← Admin Dashboard
          </Link>

          <p className="section-eyebrow">
            ADMIN • ORDERS
          </p>

          <h1>
            Orders
          </h1>

          <p>
            Monitor all customer orders across the marketplace.
          </p>

        </div>

      </section>


      {error && (
        <div className="admin-error">
          {error}
        </div>
      )}


      <section className="admin-table-card">

        {orders.length === 0 ? (

          <div className="admin-empty">
            <h2>No orders found</h2>
          </div>

        ) : (

          <div className="admin-table-wrapper">

            <table className="admin-table">

              <thead>

                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Seller</th>
                  <th>Total</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>

              </thead>

              <tbody>

                {orders.map((order) => (

                  <tr key={order._id}>

                    <td>
                      <strong>
                        #
                        {order._id
                          .slice(-8)
                          .toUpperCase()}
                      </strong>
                    </td>

                    <td>
                      {order.user?.name ||
                        "Unknown"}
                    </td>

                    <td>
                      {order.seller?.name ||
                        "Unknown"}
                    </td>

                    <td>
                      <strong>
                        ₹
                        {Number(
                          order.totalPrice || 0
                        ).toLocaleString(
                          "en-IN"
                        )}
                      </strong>
                    </td>

                    <td>

                      <span
                        className={`admin-badge ${
                          order.paymentStatus ===
                          "paid"
                            ? "paid"
                            : "pending"
                        }`}
                      >
                        {order.paymentStatus ||
                          "pending"}
                      </span>

                    </td>

                    <td>

                      <span
                        className={`admin-order-status ${
                          order.orderStatus ||
                          "processing"
                        }`}
                      >
                        {order.orderStatus ||
                          "processing"}
                      </span>

                    </td>

                    <td>

                      {order.createdAt
                        ? new Date(
                            order.createdAt
                          ).toLocaleDateString(
                            "en-IN"
                          )
                        : "—"}

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </section>

    </main>
  );
}

export default AdminOrders;