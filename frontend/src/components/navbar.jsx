import { useContext, useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import { CartContext } from "../context/cartContext";
import { WishlistContext } from "../context/wishlistContext";

function Navbar() {
  const navigate = useNavigate();

  const [showAccountMenu, setShowAccountMenu] =
    useState(false);

  // =========================
  // AUTH USER
  // =========================

  let user = null;

  try {
    const storedUser = localStorage.getItem("user");

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
  // CART + WISHLIST
  // =========================

  const { cart } = useContext(CartContext);

  const { wishlist } = useContext(WishlistContext);

  // Total cart quantity
  const cartCount = cart.reduce(
    (total, item) =>
      total + (item.quantity || 0),
    0
  );

  // Wishlist count
  const wishlistCount = wishlist.length;

  // =========================
  // ACCOUNT
  // =========================

  const handleAccountClick = () => {
    // Not logged in
    if (!user) {
      navigate("/login");
      return;
    }

    // Logged in
    setShowAccountMenu((prev) => !prev);
  };

  // =========================
  // LOGOUT
  // =========================

  const handleLogout = () => {
    localStorage.removeItem("user");

    setShowAccountMenu(false);

    navigate("/login");

    // Refresh navbar/auth state
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
              ♡
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
              🛒
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
              aria-expanded={showAccountMenu}
            >
              👤
            </button>


            {/* =========================
                ACCOUNT MENU
            ========================= */}

            {user && showAccountMenu && (

              <div className="account-menu">

                {/* USER INFO */}

                <div className="account-user">

                  <strong>
                    {user.name || "VendorVerse User"}
                  </strong>

                  <span>
                    {user.email || ""}
                  </span>

                </div>


                {/* MY ACCOUNT */}

                <button
                  type="button"
                  onClick={handleMyAccount}
                >
                  👤 My Account
                </button>

                <button
  type="button"
  onClick={() => {
    setShowAccountMenu(false);
    navigate("/orders");
  }}
>
  📦 My Orders
</button>

                {/* LOGOUT */}

                <button
                  type="button"
                  onClick={handleLogout}
                  className="logout-button"
                >
                  ↪ Logout
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