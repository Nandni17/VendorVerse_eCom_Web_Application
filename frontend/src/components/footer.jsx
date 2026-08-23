import { Link } from "react-router-dom";

// Centralized icons
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  Heart,
} from "../icons";

function Footer() {
  return (
    <footer className="site-footer">

      {/* =================================
          NEWSLETTER
      ================================= */}

      <section className="footer-newsletter">

        <div className="newsletter-content">

          <p className="newsletter-eyebrow">
            STAY IN THE LOOP
          </p>

          <h2>
            Discover what's
            <span> new.</span>
          </h2>

          <p>
            Get updates about new products,
            special events, offers and more.
          </p>

        </div>

        <form
          className="newsletter-form"
          onSubmit={(e) => e.preventDefault()}
        >

          <input
            type="email"
            placeholder="Enter your email..."
            aria-label="Email address"
            required
          />

          <button type="submit">
            Subscribe
          </button>

        </form>

      </section>


      {/* =================================
          MAIN FOOTER
      ================================= */}

      <section className="footer-main">

        {/* BRAND */}

        <div className="footer-brand">

          <Link
            to="/"
            className="footer-logo"
          >
            Vendor<span>Verse</span>
          </Link>

          <p>
            A modern marketplace for discovering
            products from independent sellers.
          </p>

          <div className="footer-socials">

            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
            >
              <FaInstagram size={20} />
            </a>

            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
            >
              <FaFacebookF size={20} />
            </a>

            <a
              href="https://x.com"
              target="_blank"
              rel="noreferrer"
              aria-label="X"
            >
              <FaTwitter size={20} />
            </a>

          </div>

        </div>


        {/* SHOP */}

        <div className="footer-column">

          <h3>
            Shop
          </h3>

          <Link to="/products">
            All Products
          </Link>

          <Link to="/products">
            New Arrivals
          </Link>

          <Link to="/products">
            Best Sellers
          </Link>

          <Link to="/wishlist">
            Wishlist
          </Link>

        </div>


        {/* COMPANY */}

        <div className="footer-column">

          <h3>
            VendorVerse
          </h3>

          <Link to="/">
            Home
          </Link>

          <Link to="/events">
            Events
          </Link>

          <Link to="/faq">
            FAQ
          </Link>

          <Link to="/contact">
            Contact Us
          </Link>

        </div>


        {/* HELP */}

        <div className="footer-column">

          <h3>
            Help
          </h3>

          <Link to="/faq">
            FAQs
          </Link>

          <Link to="/account">
            My Account
          </Link>

          <Link to="/cart">
            Cart
          </Link>

          <Link to="/contact">
            Support
          </Link>

        </div>

      </section>


      {/* =================================
          BOTTOM
      ================================= */}

      <section className="footer-bottom">

        <p>
          © {new Date().getFullYear()} VendorVerse.
          All rights reserved.
        </p>

        <div>

          <Link to="/faq">
            Terms
          </Link>

          <span>•</span>

          <Link to="/faq">
            Privacy
          </Link>

        </div>

        <p>
          Built with <Heart size={14} /> for modern shopping.
        </p>

      </section>

    </footer>
  );
}

export default Footer;