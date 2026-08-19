import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";

import { CartContext } from "../context/cartContext";
import { WishlistContext } from "../context/wishlistContext";

function ProductCard({ product }) {
  const { addToCart } = useContext(CartContext);

  const {
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
  } = useContext(WishlistContext);

  const navigate = useNavigate();

  const wishlisted = isInWishlist(product._id);


  // =========================
  // ADD TO CART
  // =========================

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

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
    <div className="product-card">

      {/* =========================
          PRODUCT IMAGE
      ========================= */}

      <div className="product-image-container">

        <Link
          to={`/products/${product._id}`}
        >

          <img
            src={product.image}
            alt={product.name}
            className="product-image"
          />

        </Link>


        {/* =========================
            WISHLIST BUTTON
        ========================= */}

        <button
          type="button"
          className={`wishlist-button ${
            wishlisted ? "active" : ""
          }`}
          onClick={handleWishlist}
          aria-label="Add to wishlist"
        >

          {wishlisted ? "♥" : "♡"}

        </button>

      </div>


      {/* =========================
          PRODUCT INFORMATION
      ========================= */}

      <div className="product-info">

        <p className="product-category">
          {product.category || "Featured"}
        </p>


        <Link
          to={`/products/${product._id}`}
          className="product-name"
        >
          {product.name}
        </Link>


        <p className="product-description">
          {product.description}
        </p>


        <div className="product-rating">

          ⭐ {product.rating || "4.8"}

          <span>
            ({product.numReviews || 0})
          </span>

        </div>


        {/* =========================
            PRICE + CART
        ========================= */}

        <div className="product-bottom">

          <span className="product-price">
            ₹
            {Number(product.price).toLocaleString("en-IN")}
          </span>


          <button
            type="button"
            className="add-cart-button"
            onClick={handleAddToCart}
          >
            Add to Cart
          </button>

        </div>

      </div>

    </div>
  );
}

export default ProductCard;