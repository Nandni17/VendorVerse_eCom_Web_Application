import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";

import {
  Heart,
  ShoppingCart,
  Star,
} from "../icons";

import { CartContext } from "../context/cartContext";
import { WishlistContext } from "../context/wishlistContext";

function ProductCard({ product }) {
  const navigate = useNavigate();

  const { addToCart } = useContext(CartContext);

  const {
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
  } = useContext(WishlistContext);

  // =========================
  // WISHLIST STATUS
  // =========================

  const wishlisted = isInWishlist(product._id);

  // =========================
  // STOCK STATUS
  // =========================

  const isOutOfStock = Number(product.stock || 0) <= 0;

  // =========================
  // ADD TO CART
  // =========================

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isOutOfStock) {
      return;
    }

    addToCart(product);

    navigate("/cart");
  };

  // =========================
  // WISHLIST
  // =========================

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (wishlisted) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <article className="product-card">

      {/* =========================
          PRODUCT IMAGE
      ========================= */}

      <div className="product-image-container">

        <Link to={`/products/${product._id}`}>

          <img
            src={product.image}
            alt={product.name}
            className="product-image"
          />

        </Link>


        {/* =========================
            OUT OF STOCK BADGE
        ========================= */}

        {isOutOfStock && (
          <span className="product-stock-badge">
            Out of Stock
          </span>
        )}


        {/* =========================
            WISHLIST BUTTON
        ========================= */}

        <button
          type="button"
          className={`wishlist-button ${
            wishlisted ? "active" : ""
          }`}
          onClick={handleWishlist}
          aria-label={
            wishlisted
              ? "Remove from wishlist"
              : "Add to wishlist"
          }
        >

          <Heart
            size={19}
            strokeWidth={1.8}
            fill={
              wishlisted
                ? "currentColor"
                : "none"
            }
          />

        </button>

      </div>


      {/* =========================
          PRODUCT INFORMATION
      ========================= */}

      <div className="product-info">

        {/* CATEGORY */}

        <p className="product-category">
          {product.category || "Featured"}
        </p>


        {/* PRODUCT NAME */}

        <Link
          to={`/products/${product._id}`}
          className="product-name"
        >
          {product.name}
        </Link>


        {/* DESCRIPTION */}

        <p className="product-description">
          {product.description ||
            "No description available."}
        </p>


        {/* =========================
            RATING
        ========================= */}

        <div className="product-rating">

          <Star
            size={15}
            strokeWidth={1.8}
            fill="currentColor"
          />

          <span>
            {Number(
              product.rating || 0
            ).toFixed(1)}
          </span>

          <span className="product-review-count">
            ({product.numReviews || 0})
          </span>

        </div>


        {/* =========================
            PRICE + CART
        ========================= */}

        <div className="product-bottom">

          <span className="product-price">
            ₹
            {Number(
              product.price || 0
            ).toLocaleString("en-IN")}
          </span>


          <button
            type="button"
            className="add-cart-button"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
          >

            <ShoppingCart
              size={17}
              strokeWidth={1.8}
            />

            <span>
              {isOutOfStock
                ? "Out of Stock"
                : "Add to Cart"}
            </span>

          </button>

        </div>

      </div>

    </article>
  );
}

export default ProductCard;