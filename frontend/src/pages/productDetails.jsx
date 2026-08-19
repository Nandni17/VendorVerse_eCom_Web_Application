import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import API from "../api/axios";

import { CartContext } from "../context/cartContext";
import { WishlistContext } from "../context/wishlistContext";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { addToCart } = useContext(CartContext);

  const {
    wishlist,
    addToWishlist,
    removeFromWishlist,
  } = useContext(WishlistContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ========================================
  // FETCH PRODUCT
  // ========================================

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await API.get(`/api/products/${id}`);

        setProduct(response.data);
      } catch (err) {
        console.error("Product fetch error:", err);

        setError(
          err.response?.data?.message ||
            "Unable to load product."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // ========================================
  // LOADING
  // ========================================

  if (loading) {
    return (
      <div className="product-details-status">
        <div className="loader"></div>
        <p>Loading product...</p>
      </div>
    );
  }

  // ========================================
  // ERROR
  // ========================================

  if (error) {
    return (
      <div className="product-details-status">
        <h2>Product not found</h2>

        <p>{error}</p>

        <Link
          to="/products"
          className="back-button"
        >
          ← Back to Shop
        </Link>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  // ========================================
  // WISHLIST STATUS
  // ========================================

  const isWishlisted = wishlist?.some(
    (item) => item._id === product._id
  );

  // ========================================
  // WISHLIST
  // ========================================

  const handleWishlist = () => {
    if (isWishlisted) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product);
    }
  };

  // ========================================
  // ADD TO CART
  // ========================================

  const handleAddToCart = () => {
    if (product.stock <= 0) {
      return;
    }

    addToCart(product);

    navigate("/cart");
  };

  // ========================================
  // BUY NOW
  // ========================================

  const handleBuyNow = () => {
    if (product.stock <= 0) {
      return;
    }

    addToCart(product);

    navigate("/checkout");
  };

  return (
    <main className="product-details-page">

      {/* =====================================
          BREADCRUMB
      ====================================== */}

      <div className="product-breadcrumb">

        <Link to="/">
          Home
        </Link>

        <span>/</span>

        <Link to="/products">
          Shop
        </Link>

        <span>/</span>

        <span>
          {product.name}
        </span>

      </div>


      {/* =====================================
          MAIN PRODUCT SECTION
      ====================================== */}

      <section className="product-details-container">

        {/* =================================
            LEFT SIDE
        ================================== */}

        <div className="product-details-image-section">

          <div className="product-details-image-wrapper">

            <img
              src={product.image}
              alt={product.name}
              className="product-details-image"
            />

          </div>

        </div>


        {/* =================================
            RIGHT SIDE
        ================================== */}

        <div className="product-details-info">

          {/* Category */}

          <p className="details-category">
            {product.category || "Featured"}
          </p>


          {/* Product Name */}

          <h1>
            {product.name}
          </h1>


          {/* Rating */}

          <div className="details-rating">

            <span>
              ⭐ {product.rating || "4.8"}
            </span>

            <span>
              ({product.numReviews || 0} reviews)
            </span>

          </div>


          {/* Price */}

          <div className="details-price">

            ₹{Number(product.price).toLocaleString("en-IN")}

          </div>


          {/* Stock */}

          <div
            className={
              product.stock > 0
                ? "stock available"
                : "stock unavailable"
            }
          >

            {product.stock > 0
              ? `✓ In Stock (${product.stock} available)`
              : "✕ Out of Stock"}

          </div>


          {/* Divider */}

          <div className="details-divider"></div>


          {/* Description */}

          <div className="details-description">

            <h3>
              Description
            </h3>

            <p>
              {product.description ||
                "No description available for this product."}
            </p>

          </div>


          {/* =================================
              ACTION BUTTONS
          ================================== */}

          <div className="details-actions">

            {/* WISHLIST */}

            <button
              type="button"
              className={`wishlist-details-button ${
                isWishlisted ? "wishlisted" : ""
              }`}
              onClick={handleWishlist}
            >

              {isWishlisted
                ? "♥ Wishlisted"
                : "♡ Wishlist"}

            </button>


            {/* ADD TO CART */}

            <button
              type="button"
              className="details-cart-button"
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
            >

              🛒 Add to Cart

            </button>


            {/* BUY NOW */}

            <button
              type="button"
              className="buy-now-button"
              onClick={handleBuyNow}
              disabled={product.stock <= 0}
            >

              Buy Now

            </button>

          </div>

        </div>

      </section>


      {/* =====================================
          EXTRA INFORMATION
      ====================================== */}

      <section className="product-extra-information">

        {/* DESCRIPTION */}

        <div className="extra-card">

          <h2>
            Product Description
          </h2>

          <p>
            {product.description ||
              "No additional description available."}
          </p>

        </div>


        {/* SELLER */}

        <div className="extra-card">

          <h2>
            Seller Information
          </h2>

          <p>
            Seller:{" "}
            <strong>
              {product.seller?.name || "Vendor"}
            </strong>
          </p>

          {product.seller?.email && (
            <p>
              {product.seller.email}
            </p>
          )}

        </div>


        {/* SPECIFICATIONS */}

        <div className="extra-card">

          <h2>
            Specifications
          </h2>

          <div className="specification-row">

            <span>
              Category
            </span>

            <strong>
              {product.category || "N/A"}
            </strong>

          </div>


          <div className="specification-row">

            <span>
              Availability
            </span>

            <strong>
              {product.stock > 0
                ? "Available"
                : "Out of Stock"}
            </strong>

          </div>


          <div className="specification-row">

            <span>
              Stock
            </span>

            <strong>
              {product.stock || 0}
            </strong>

          </div>

        </div>

      </section>

    </main>
  );
}

export default ProductDetails;