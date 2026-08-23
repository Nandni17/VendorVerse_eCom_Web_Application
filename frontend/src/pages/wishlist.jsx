import { useContext } from "react";
import { Link } from "react-router-dom";

import { WishlistContext } from "../context/wishlistContext";
import {
  Heart,
  X,
  ArrowRight,
} from "../icons";

function Wishlist() {
  const {
    wishlist,
    removeFromWishlist,
  } = useContext(WishlistContext);

  return (
    <main className="wishlist-page">

      <div className="wishlist-header">

        <p className="eyebrow">
          YOUR SAVED PRODUCTS
        </p>

        <h1>
          My <span>Wishlist</span>
        </h1>

        <p className="wishlist-subtitle">
          Products you want to keep an eye on.
        </p>

      </div>


      {wishlist.length === 0 ? (

        <div className="wishlist-empty">

          <div className="wishlist-empty-icon">
            <Heart size={42} strokeWidth={1.5} />
          </div>

          <h2>
            Your wishlist is empty
          </h2>

          <p>
            Save products you love and find them here later.
          </p>

          <Link
            to="/products"
            className="wishlist-shop-button"
          >
            Browse Products
            <ArrowRight size={18} />
          </Link>

        </div>

      ) : (

        <div className="wishlist-grid">

          {wishlist.map((product) => (

            <div
              className="wishlist-card"
              key={product._id}
            >

              <Link
                to={`/products/${product._id}`}
                className="wishlist-image-wrapper"
              >

                <img
                  src={product.image}
                  alt={product.name}
                  className="wishlist-image"
                />

              </Link>


              <div className="wishlist-card-info">

                <p className="product-category">
                  {product.category || "Featured"}
                </p>

                <Link
                  to={`/products/${product._id}`}
                  className="wishlist-product-name"
                >
                  {product.name}
                </Link>

                <p className="wishlist-price">
                  ₹
                  {Number(product.price).toLocaleString("en-IN")}
                </p>


                <button
                  type="button"
                  className="remove-wishlist-button"
                  onClick={() =>
                    removeFromWishlist(product._id)
                  }
                >
                  <X size={16} />
                  Remove
                </button>

              </div>

            </div>

          ))}

        </div>

      )}

    </main>
  );
}

export default Wishlist;