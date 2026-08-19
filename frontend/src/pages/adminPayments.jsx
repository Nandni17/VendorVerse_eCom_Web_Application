import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import API from "../api/axios";

function AdminPayments() {
  const [data, setData] = useState({
    paidOrders: 0,
    pendingPayments: 0,
    failedPayments: 0,
    totalRevenue: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await API.get(
          "/api/admin/payments"
        );

        setData(response.data);
      } catch (err) {
        console.error(
          "Payment overview error:",
          err
        );

        setError(
          err.response?.data?.message ||
            "Unable to load payment overview."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  if (loading) {
    return (
      <main className="admin-page">
        <div className="admin-status">
          <div className="loader"></div>
          <p>Loading payment overview...</p>
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
            ADMIN • PAYMENTS
          </p>

          <h1>
            Payments
          </h1>

          <p>
            Review payment activity and marketplace revenue.
          </p>
        </div>

      </section>


      {error && (
        <div className="admin-error">
          {error}
        </div>
      )}


      <section className="admin-payment-stats">

        <div className="admin-payment-card">

          <span>
            Total Revenue
          </span>

          <strong>
            ₹
            {Number(
              data.totalRevenue || 0
            ).toLocaleString("en-IN")}
          </strong>

        </div>


        <div className="admin-payment-card paid">

          <span>
            Paid Orders
          </span>

          <strong>
            {data.paidOrders}
          </strong>

        </div>


        <div className="admin-payment-card pending">

          <span>
            Pending
          </span>

          <strong>
            {data.pendingPayments}
          </strong>

        </div>


        <div className="admin-payment-card failed">

          <span>
            Failed
          </span>

          <strong>
            {data.failedPayments}
          </strong>

        </div>

      </section>

    </main>
  );
}

export default AdminPayments;