import { useContext, useEffect, useState } from "react";
import API from "../api/axios";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import { CartContext } from "../context/cartContext";
import { WishlistContext } from "../context/wishlistContext";

// Centralized icons
import {
  User,
  Heart,
  ShoppingCart,
  LogOut,
} from "../icons";

function Navbar() {
  const navigate = useNavigate();

  const [showAccountMenu, setShowAccountMenu] =
    useState(false);

  const [profileImage, setProfileImage] =
    useState("");

  // =========================
  // AUTH USER
  // =========================

  let user = null;

  try {
    const storedUser =
      localStorage.getItem("user");

    if (storedUser) {
      user = JSON.parse(storedUser);
    }
  } catch (error) {
    console.error(
      "Unable to read user from localStorage:",
      error
    );

    localStorage.removeItem("user");
  }

  // =========================
  // PROFILE IMAGE
  // =========================

  useEffect(() => {
    const fetchProfileImage = async () => {
      if (!user) {
        setProfileImage("");
        return;
      }

      try {
        const response = await API.get(
          "/api/users/profile"
        );

        setProfileImage(
          response.data.profileImage || ""
        );
      } catch (error) {
        console.error(
          "Unable to load profile image:",
          error
        );
      }
    };

    fetchProfileImage();
  }, []);

  // =========================
  // CART + WISHLIST
  // =========================

  const { cart } =
    useContext(CartContext);

  const { wishlist } =
    useContext(WishlistContext);

  // Total cart quantity
  const cartCount = cart.reduce(
    (total, item) =>
      total + (item.quantity || 0),
    0
  );

  // Wishlist count
  const wishlistCount =
    wishlist.length;

  // =========================
  // ACCOUNT
  // =========================

  const handleAccountClick = () => {
    if (!user) {
      navigate("/login");
      return;
    }

    setShowAccountMenu(
      (prev) => !prev
    );
  };

  // =========================
  // LOGOUT
  // =========================

  const handleLogout = () => {
    localStorage.removeItem("user");

    setShowAccountMenu(false);

    navigate("/login");

    window.location.reload();
  };

  // =========================
  // MY ACCOUNT
  // =========================

  const handleMyAccount = () => {
    setShowAccountMenu(false);

    navigate("/account");
  };

  return (
    <header className="navbar">

      <div className="navbar-container">

        {/* =========================
            LOGO
        ========================= */}

        <Link
          to="/"
          className="logo"
        >
          Vendor<span>Verse</span>
        </Link>


        {/* =========================
            NAVIGATION
        ========================= */}

        <nav className="nav-links">

          {/* HOME */}

          <Link to="/">
            Home
          </Link>


          {/* SHOP */}

          <Link to="/products">
            Shop
          </Link>


          <Link to="/events">
            Events
          </Link>


          <Link to="/faq">
            FAQ
          </Link>


          {/* =========================
              WISHLIST
          ========================= */}

          <Link
            to="/wishlist"
            className="navbar-icon-link"
            aria-label="Wishlist"
          >

            <span className="navbar-icon">
              <Heart size={22} />
            </span>

            {wishlistCount > 0 && (
              <span className="navbar-badge">
                {wishlistCount}
              </span>
            )}

          </Link>


          {/* =========================
              CART
          ========================= */}

          <Link
            to="/cart"
            className="navbar-icon-link"
            aria-label="Cart"
          >

            <span className="navbar-icon">
              <ShoppingCart size={22} />
            </span>

            {cartCount > 0 && (
              <span className="navbar-badge">
                {cartCount}
              </span>
            )}

          </Link>


          {/* =========================
              ACCOUNT
          ========================= */}

          <div className="account-wrapper">

            <button
              type="button"
              className="account-button"
              onClick={handleAccountClick}
              aria-label="Account"
              aria-expanded={
                showAccountMenu
              }
            >

              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  className="navbar-profile-image"
                />
              ) : (
                <User size={22} />
              )}

            </button>


            {/* =========================
                ACCOUNT MENU
            ========================= */}

            {user &&
              showAccountMenu && (

                <div className="account-menu">

                  {/* USER INFO */}

                  <div className="account-user">

                    <strong>
                      {user.name ||
                        "VendorVerse User"}
                    </strong>

                    <span>
                      {user.email || ""}
                    </span>

                  </div>


                  {/* MY ACCOUNT */}

                  <button
                    type="button"
                    onClick={
                      handleMyAccount
                    }
                  >
                    <User size={18} />
                    My Account
                  </button>


                  {/* LOGOUT */}

                  <button
                    type="button"
                    onClick={
                      handleLogout
                    }
                    className="logout-button"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>

                </div>

              )}

          </div>

        </nav>

      </div>

    </header>
  );
}

export default Navbar;