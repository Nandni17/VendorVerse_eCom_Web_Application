import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import API from "../api/axios";

import {
  Users,
  Store,
  Package,
  Truck,
  CreditCard,
  Mail,
} from "../icons";

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalSellers: 0,
    totalProducts: 0,
    totalOrders: 0,
    paidOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await API.get(
          "/api/admin/dashboard"
        );

        setStats(response.data);
      } catch (err) {
        console.error(
          "Admin dashboard error:",
          err
        );

        setError(
          err.response?.data?.message ||
            err.response?.data?.error ||
            "Unable to load admin dashboard."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <main className="admin-page">
        <div className="admin-status">
          <div className="loader"></div>

          <p>
            Loading admin dashboard...
          </p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="admin-page">
        <div className="admin-status error">
          <h2>
            Unable to load dashboard
          </h2>

          <p>
            {error}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="admin-page">

      {/* HEADER */}

      <section className="admin-header">

        <div>

          <p className="section-eyebrow">
            VENDORVERSE ADMIN
          </p>

          <h1>
            Admin Dashboard
          </h1>

          <p>
            Manage your marketplace, users,
            sellers, products and orders.
          </p>

        </div>

      </section>


      {/* STATS */}

      <section className="admin-stats">

        <div className="admin-stat-card">
          <span>Customers</span>
          <strong>{stats.totalUsers}</strong>
        </div>

        <div className="admin-stat-card">
          <span>Sellers</span>
          <strong>{stats.totalSellers}</strong>
        </div>

        <div className="admin-stat-card">
          <span>Products</span>
          <strong>{stats.totalProducts}</strong>
        </div>

        <div className="admin-stat-card">
          <span>Orders</span>
          <strong>{stats.totalOrders}</strong>
        </div>

        <div className="admin-stat-card revenue">
          <span>Revenue</span>

          <strong>
            ₹
            {Number(
              stats.totalRevenue || 0
            ).toLocaleString("en-IN")}
          </strong>
        </div>

        <div className="admin-stat-card success">
          <span>Paid Orders</span>
          <strong>{stats.paidOrders}</strong>
        </div>

        <div className="admin-stat-card warning">
          <span>Processing Orders</span>
          <strong>{stats.pendingOrders}</strong>
        </div>

      </section>


      {/* QUICK ACTIONS */}

      <section className="admin-actions">

        <Link
          to="/admin/users"
          className="admin-action-card"
        >

          <span className="admin-action-icon">
            <Users
              size={22}
              strokeWidth={1.8}
            />
          </span>

          <div>
            <h3>
              Customers
            </h3>

            <p>
              View registered customers.
            </p>
          </div>

          <span>→</span>

        </Link>


        <Link
          to="/admin/sellers"
          className="admin-action-card"
        >

          <span className="admin-action-icon">
            <Store
              size={22}
              strokeWidth={1.8}
            />
          </span>

          <div>
            <h3>
              Sellers
            </h3>

            <p>
              View marketplace sellers.
            </p>
          </div>

          <span>→</span>

        </Link>


        <Link
          to="/admin/products"
          className="admin-action-card"
        >

          <span className="admin-action-icon">
            <Package
              size={22}
              strokeWidth={1.8}
            />
          </span>

          <div>
            <h3>
              Products
            </h3>

            <p>
              Review marketplace products.
            </p>
          </div>

          <span>→</span>

        </Link>


        <Link
          to="/admin/orders"
          className="admin-action-card"
        >

          <span className="admin-action-icon">
            <Truck
              size={22}
              strokeWidth={1.8}
            />
          </span>

          <div>
            <h3>
              Orders
            </h3>

            <p>
              Monitor all marketplace orders.
            </p>
          </div>

          <span>→</span>

        </Link>


        <Link
          to="/admin/payments"
          className="admin-action-card"
        >

          <span className="admin-action-icon">
            <CreditCard
              size={22}
              strokeWidth={1.8}
            />
          </span>

          <div>
            <h3>
              Payments
            </h3>

            <p>
              Review payment activity.
            </p>
          </div>

          <span>→</span>

        </Link>


        <Link
          to="/admin/contacts"
          className="admin-action-card"
        >

          <span className="admin-action-icon">
            <Mail
              size={22}
              strokeWidth={1.8}
            />
          </span>

          <div>
            <h3>
              Contact Messages
            </h3>

            <p>
              View and manage customer messages.
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

export default AdminDashboard;