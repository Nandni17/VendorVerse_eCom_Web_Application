import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  Laptop,
  Footprints,
  Gamepad2,
  Watch,
  Truck,
  Lock,
  Store,
  ArrowRight,
} from "lucide-react";

import API from "../api/axios";
import ProductCard from "../components/productCard";

function Home() {
  const [products, setProducts] = useState([]);
  const [banners, setBanners] = useState([]);

  const [loadingProducts, setLoadingProducts] =
    useState(true);

  const [loadingBanners, setLoadingBanners] =
    useState(true);

  const [heroIndex, setHeroIndex] = useState(0);

  // =========================
  // FETCH PRODUCTS
  // =========================

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await API.get("/api/products");

        setProducts(response.data);
      } catch (err) {
        console.error(
          "Home products error:",
          err
        );
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, []);

  // =========================
  // FETCH HERO BANNERS
  // =========================

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await API.get(
          "/api/hero-banners"
        );

        setBanners(response.data);
      } catch (err) {
        console.error(
          "Hero banners error:",
          err
        );
      } finally {
        setLoadingBanners(false);
      }
    };

    fetchBanners();
  }, []);

  // =========================
  // AUTO SLIDE
  // =========================

  useEffect(() => {
    if (banners.length <= 1) {
      return;
    }

    const interval = setInterval(() => {
      setHeroIndex(
        (prevIndex) =>
          (prevIndex + 1) % banners.length
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [banners.length]);

  const currentBanner =
    banners[heroIndex];

  console.log(
    "CURRENT BANNER:",
    currentBanner
  );

  console.log(
    "CURRENT IMAGE:",
    currentBanner?.image
  );

  const trendingProducts =
    products.slice(0, 8);

  return (
    <main className="home-page">

      {/* =========================
          HERO
      ========================= */}

      <section className="hero-section">

        {loadingBanners ? (

          <div className="hero-loading">
            <div className="loader"></div>
          </div>

        ) : currentBanner ? (

          <>

            <div className="hero-content">

              <p className="hero-eyebrow">
                VENDORVERSE MARKETPLACE
              </p>

              <h1>
                {currentBanner.title}
              </h1>

              <p className="hero-description">
                {currentBanner.subtitle}
              </p>

              <div className="hero-actions">

                <Link
                  to={currentBanner.buttonLink}
                  className="hero-primary-button"
                >
                  {currentBanner.buttonText}

                  <ArrowRight
                    size={18}
                    strokeWidth={1.8}
                  />
                </Link>

                <Link
                  to="/products"
                  className="hero-secondary-button"
                >
                  Browse Products
                </Link>

              </div>


              {/* Dots */}

              <div className="hero-dots">

                {banners.map(
                  (banner, index) => (
                    <button
                      key={banner._id}
                      type="button"
                      className={
                        index === heroIndex
                          ? "hero-dot active"
                          : "hero-dot"
                      }
                      onClick={() =>
                        setHeroIndex(index)
                      }
                      aria-label={`Go to banner ${
                        index + 1
                      }`}
                    />
                  )
                )}

              </div>

            </div>


            <div className="hero-visual">

              <div className="hero-glow"></div>

              <div
                className="hero-card"
                key={currentBanner._id}
              >

                <img
                  key={currentBanner._id}
                  src={currentBanner.image}
                  alt={currentBanner.title}
                  className="hero-banner-image"
                />

              </div>

            </div>

          </>

        ) : (

          <div className="hero-empty">

            <h1>
              Welcome to VendorVerse
            </h1>

            <p>
              Discover products from
              independent sellers.
            </p>

            <Link
              to="/products"
              className="hero-primary-button"
            >
              Start Shopping

              <ArrowRight
                size={18}
                strokeWidth={1.8}
              />
            </Link>

          </div>

        )}

      </section>


      {/* =========================
          CATEGORY SECTION
      ========================= */}

      <section className="home-section">

        <div className="section-heading">

          <div>

            <p className="section-eyebrow">
              EXPLORE
            </p>

            <h2>
              Shop by category
            </h2>

          </div>

        </div>


        <div className="category-cards">

          <Link
            to="/products"
            className="category-card"
          >

            <span>
              <Laptop
                size={30}
                strokeWidth={1.8}
              />
            </span>

            <h3>
              Electronics
            </h3>

            <p>
              Smart tech & gadgets
            </p>

          </Link>


          <Link
            to="/products"
            className="category-card"
          >

            <span>
              <Footprints
                size={30}
                strokeWidth={1.8}
              />
            </span>

            <h3>
              Fashion
            </h3>

            <p>
              Style for every day
            </p>

          </Link>


          <Link
            to="/products"
            className="category-card"
          >

            <span>
              <Gamepad2
                size={30}
                strokeWidth={1.8}
              />
            </span>

            <h3>
              Gaming
            </h3>

            <p>
              Level up your setup
            </p>

          </Link>


          <Link
            to="/products"
            className="category-card"
          >

            <span>
              <Watch
                size={30}
                strokeWidth={1.8}
              />
            </span>

            <h3>
              Accessories
            </h3>

            <p>
              Small details, big impact
            </p>

          </Link>

        </div>

      </section>


      {/* =========================
          TRENDING PRODUCTS
      ========================= */}

      <section className="home-section">

        <div className="section-heading">

          <div>

            <p className="section-eyebrow">
              TRENDING NOW
            </p>

            <h2>
              Products people love
            </h2>

          </div>

          <Link
            to="/products"
            className="view-all-link"
          >
            View all

            <ArrowRight
              size={17}
              strokeWidth={1.8}
            />
          </Link>

        </div>


        {loadingProducts ? (

          <div className="home-loading">

            <div className="loader"></div>

            <p>
              Loading products...
            </p>

          </div>

        ) : (

          <div className="home-product-grid">

            {trendingProducts.map(
              (product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                />
              )
            )}

          </div>

        )}

      </section>


      {/* =========================
          WHY VENDORVERSE
      ========================= */}

      <section className="why-section">

        <div className="section-heading centered">

          <p className="section-eyebrow">
            THE VENDORVERSE DIFFERENCE
          </p>

          <h2>
            Built for modern shopping.
          </h2>

        </div>


        <div className="benefit-grid">

          <div className="benefit-card">

            <div className="benefit-icon">
              <Truck
                size={30}
                strokeWidth={1.8}
              />
            </div>

            <h3>
              Easy Shopping
            </h3>

            <p>
              Search, filter, save and
              purchase products easily.
            </p>

          </div>


          <div className="benefit-card">

            <div className="benefit-icon">
              <Lock
                size={30}
                strokeWidth={1.8}
              />
            </div>

            <h3>
              Secure Payments
            </h3>

            <p>
              Checkout securely through
              Stripe.
            </p>

          </div>


          <div className="benefit-card">

            <div className="benefit-icon">
              <Store
                size={30}
                strokeWidth={1.8}
              />
            </div>

            <h3>
              Independent Sellers
            </h3>

            <p>
              Multiple sellers, one
              marketplace.
            </p>

          </div>

        </div>

      </section>


      {/* =========================
          CTA
      ========================= */}

      <section className="home-cta">

        <div>

          <p className="section-eyebrow">
            READY TO EXPLORE?
          </p>

          <h2>
            Your next favorite
            product is waiting.
          </h2>

        </div>

        <Link
          to="/products"
          className="hero-primary-button"
        >
          Start Shopping

          <ArrowRight
            size={18}
            strokeWidth={1.8}
          />
        </Link>

      </section>

    </main>
  );
}

export default Home;