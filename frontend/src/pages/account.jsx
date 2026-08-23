import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../api/axios";

import {
  User,
  Store,
  Shield,
  Package,
  Heart,
  MessageCircle,
  LayoutDashboard,
  LogOut,
  Pencil,
  ArrowRight,
} from "../icons";

function Account() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const response = await API.get("/api/users/profile");
        setProfile(response.data);
      } catch (err) {
        console.error("Unable to load profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
    window.location.reload();
  };

  // =========================
  // NOT LOGGED IN
  // =========================

  if (!user) {
    return (
      <main className="account-page">
        <div className="account-container">

          <div className="account-icon-large">
            <User size={32} />
          </div>

          <p className="account-eyebrow">
            VENDORVERSE ACCOUNT
          </p>

          <h1>
            Login Required
          </h1>

          <p>
            Please login to view your account.
          </p>

          <button
            className="account-primary-button"
            onClick={() => navigate("/login")}
          >
            Login
          </button>

        </div>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="account-page">
        <div className="account-container">
          <p>Loading profile...</p>
        </div>
      </main>
    );
  }

  const isSeller = user.role === "seller";
  const isAdmin = user.role === "admin";

  return (
    <main className="account-page">

      <div className="account-container">

        {/* =========================
            HEADER
        ========================= */}

        <div className="account-header">

          <div className="account-icon-large">

            {profile?.profileImage ? (
              <img
                src={profile.profileImage}
                alt="Profile"
                className="account-profile-image"
              />
            ) : (
              isAdmin ? (
                <Shield size={32} />
              ) : isSeller ? (
                <Store size={32} />
              ) : (
                <User size={32} />
              )
            )}

          </div>

          <div>

            <p className="account-eyebrow">
              VENDORVERSE{" "}
              {isAdmin
                ? "ADMIN"
                : isSeller
                ? "SELLER"
                : "ACCOUNT"}
            </p>

            <h1>
              {isAdmin
                ? "Admin Account"
                : isSeller
                ? "Seller Account"
                : "My Account"}
            </h1>

            <p>
              {isAdmin
                ? "Manage your admin profile and marketplace."
                : isSeller
                ? "Manage your seller profile and marketplace activity."
                : "Manage your profile, orders and wishlist."}
            </p>

          </div>

        </div>


        {/* =========================
            PERSONAL INFORMATION
        ========================= */}

        <section className="account-card">

          <div className="account-card-header">

            <div>

              <p className="card-eyebrow">
                PROFILE
              </p>

              <h2>
                Personal Information
              </h2>

            </div>


            <button
              type="button"
              className="edit-profile-button"
              onClick={() => navigate("/edit-profile")}
            >
              <Pencil size={16} />
              Edit Profile
            </button>

          </div>


          <div className="profile-info">

            <div className="profile-item">
              <span>Name</span>

              <strong>
                {profile?.name || user.name}
              </strong>
            </div>


            <div className="profile-item">
              <span>Email</span>

              <strong>
                {profile?.email || user.email}
              </strong>
            </div>


            <div className="profile-item">
              <span>Account Type</span>

              <strong className="role-badge">
                {user.role || "buyer"}
              </strong>
            </div>


            {profile?.phone && (
              <div className="profile-item">

                <span>
                  Phone
                </span>

                <strong>
                  {profile.phone}
                </strong>

              </div>
            )}


            {profile?.city && (
              <div className="profile-item">

                <span>
                  City
                </span>

                <strong>
                  {profile.city}
                </strong>

              </div>
            )}


            {profile?.address && (
              <div className="profile-item address-item">

                <span>
                  Address
                </span>

                <strong>
                  {profile.address}
                </strong>

              </div>
            )}

          </div>

        </section>


        {/* =================================================
            BUYER ACCOUNT OPTIONS
        ================================================= */}

        {user.role === "buyer" && (

          <section className="account-options">

            {/* MY ORDERS */}

            <button
              className="account-option"
              onClick={() => navigate("/orders")}
            >

              <div className="option-icon">
                <Package size={22} />
              </div>

              <div className="option-content">

                <h3>
                  My Orders
                </h3>

                <p>
                  View your previous and current orders.
                </p>

              </div>

              <span className="option-arrow">
                <ArrowRight size={22} />
              </span>

            </button>


            {/* WISHLIST */}

            <button
              className="account-option"
              onClick={() => navigate("/wishlist")}
            >

              <div className="option-icon">
                <Heart size={22} />
              </div>

              <div className="option-content">

                <h3>
                  My Wishlist
                </h3>

                <p>
                  View products you saved for later.
                </p>

              </div>

              <span className="option-arrow">
                <ArrowRight size={22} />
              </span>

            </button>


            {/* LOGOUT */}

            <button
              className="account-option logout-option"
              onClick={handleLogout}
            >

              <div className="option-icon">
                <LogOut size={22} />
              </div>

              <div className="option-content">

                <h3>
                  Logout
                </h3>

                <p>
                  Sign out of your VendorVerse account.
                </p>

              </div>

              <span className="option-arrow">
                <ArrowRight size={22} />
              </span>

            </button>

          </section>

        )}


        {/* =================================================
            SELLER ACCOUNT OPTIONS
        ================================================= */}

        {user.role === "seller" && (

          <section className="account-options">

            {/* SELLER DASHBOARD */}

            <button
              className="account-option"
              onClick={() => navigate("/seller")}
            >

              <div className="option-icon">
                <LayoutDashboard size={22} />
              </div>

              <div className="option-content">

                <h3>
                  Seller Dashboard
                </h3>

                <p>
                  Manage your products, orders and sales.
                </p>

              </div>

              <span className="option-arrow">
                <ArrowRight size={22} />
              </span>

            </button>


            {/* MESSAGES */}

            <button
              className="account-option"
              onClick={() => navigate("/conversations")}
            >

              <div className="option-icon">
                <MessageCircle size={22} />
              </div>

              <div className="option-content">

                <h3>
                  Messages
                </h3>

                <p>
                  Chat with buyers about your products and orders.
                </p>

              </div>

              <span className="option-arrow">
                <ArrowRight size={22} />
              </span>

            </button>


            {/* LOGOUT */}

            <button
              className="account-option logout-option"
              onClick={handleLogout}
            >

              <div className="option-icon">
                <LogOut size={22} />
              </div>

              <div className="option-content">

                <h3>
                  Logout
                </h3>

                <p>
                  Sign out of your VendorVerse account.
                </p>

              </div>

              <span className="option-arrow">
                <ArrowRight size={22} />
              </span>

            </button>

          </section>

        )}


        {/* =================================================
            ADMIN ACCOUNT OPTIONS
        ================================================= */}

        {user.role === "admin" && (

          <section className="account-options">

            {/* ADMIN DASHBOARD */}

            <button
              className="account-option"
              onClick={() => navigate("/admin")}
            >

              <div className="option-icon">
                <Shield size={22} />
              </div>

              <div className="option-content">

                <h3>
                  Admin Dashboard
                </h3>

                <p>
                  Manage users, sellers, products, orders and payments.
                </p>

              </div>

              <span className="option-arrow">
                <ArrowRight size={22} />
              </span>

            </button>


            {/* LOGOUT */}

            <button
              className="account-option logout-option"
              onClick={handleLogout}
            >

              <div className="option-icon">
                <LogOut size={22} />
              </div>

              <div className="option-content">

                <h3>
                  Logout
                </h3>

                <p>
                  Sign out of your VendorVerse account.
                </p>

              </div>

              <span className="option-arrow">
                <ArrowRight size={22} />
              </span>

            </button>

          </section>

        )}

      </div>

    </main>
  );
}

export default Account;

