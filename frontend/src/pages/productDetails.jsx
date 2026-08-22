import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import API from "../api/axios";

import { CartContext } from "../context/cartContext";
import { WishlistContext } from "../context/wishlistContext";
import { AuthContext } from "../context/authContext";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  const {
    wishlist,
    addToWishlist,
    removeFromWishlist,
  } = useContext(WishlistContext);

  // ========================================
  // PRODUCT STATES
  // ========================================

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ========================================
  // REVIEW STATES
  // ========================================

  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewsError, setReviewsError] = useState("");

  // New review
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewMessage, setReviewMessage] = useState("");

  // Edit review
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editRating, setEditRating] = useState(0);
  const [editComment, setEditComment] = useState("");
  const [editSubmitting, setEditSubmitting] = useState(false);

  // ========================================
  // GET USER ID
  // Supports both:
  // user._id
  // user.id
  // ========================================

  const getUserId = (userObject) => {
    return userObject?._id || userObject?.id;
  };

  // ========================================
  // FETCH PRODUCT
  // ========================================

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await API.get(
          `/api/products/${id}`
        );

        setProduct(response.data);
      } catch (err) {
        console.error(
          "Product fetch error:",
          err
        );

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
  // FETCH PRODUCT REVIEWS
  // ========================================

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setReviewsLoading(true);
        setReviewsError("");

        const response = await API.get(
          `/api/reviews/product/${id}`
        );

        setReviews(response.data);
      } catch (err) {
        console.error(
          "Reviews fetch error:",
          err
        );

        setReviewsError(
          err.response?.data?.message ||
            "Unable to load reviews."
        );
      } finally {
        setReviewsLoading(false);
      }
    };

    fetchReviews();
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

  // ========================================
  // CHAT WITH SELLER
  // ========================================

  const handleChatWithSeller = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (!product.seller?._id) {
      setError(
        "Seller information is not available."
      );
      return;
    }

    try {
      setError("");

      const response = await API.post(
        "/api/chat/conversation",
        {
          sellerId: product.seller._id,
          productId: product._id,
        }
      );

      const conversationId =
        response.data.conversation._id;

      navigate(`/chat/${conversationId}`, {
        state: {
          productId: product._id,
        },
      });
    } catch (err) {
      console.error(
        "Chat with seller error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to start chat with seller."
      );
    }
  };

  // ========================================
  // SUBMIT NEW REVIEW
  // ========================================

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!user) {
      navigate("/login");
      return;
    }

    if (reviewRating === 0) {
      setReviewMessage(
        "Please select a rating."
      );
      return;
    }

    if (!reviewComment.trim()) {
      setReviewMessage(
        "Please write a review."
      );
      return;
    }

    try {
      setReviewSubmitting(true);
      setReviewMessage("");

      await API.post(
        `/api/reviews/product/${id}`,
        {
          rating: reviewRating,
          comment: reviewComment.trim(),
        }
      );

      // Refresh reviews
      const reviewsResponse = await API.get(
        `/api/reviews/product/${id}`
      );

      setReviews(reviewsResponse.data);

      // Refresh product
      const productResponse = await API.get(
        `/api/products/${id}`
      );

      setProduct(productResponse.data);

      // Clear form
      setReviewRating(0);
      setReviewComment("");

      setReviewMessage(
        "Review submitted successfully! ⭐"
      );
    } catch (err) {
      console.error(
        "Submit review error:",
        err
      );

      const message =
        err.response?.data?.message ||
        "Unable to submit review.";

      setReviewMessage(message);

      // Clear form when user is not eligible
      if (
        message ===
        "You can review this product only after purchasing and receiving it."
      ) {
        setReviewRating(0);
        setReviewComment("");
      }
    } finally {
      setReviewSubmitting(false);
    }
  };

  // ========================================
  // START EDIT REVIEW
  // ========================================

  const handleEditReview = (review) => {
    setEditingReviewId(review._id);
    setEditRating(review.rating);
    setEditComment(review.comment);
    setReviewMessage("");
  };

  // ========================================
  // CANCEL EDIT REVIEW
  // ========================================

  const handleCancelEdit = () => {
    setEditingReviewId(null);
    setEditRating(0);
    setEditComment("");
    setReviewMessage("");
  };

  // ========================================
  // UPDATE REVIEW
  // ========================================

  const handleUpdateReview = async (
    reviewId
  ) => {
    if (!editRating || editRating < 1) {
      setReviewMessage(
        "Please select a rating."
      );
      return;
    }

    if (!editComment.trim()) {
      setReviewMessage(
        "Please write a review."
      );
      return;
    }

    try {
      setEditSubmitting(true);
      setReviewMessage("");

      await API.put(
        `/api/reviews/${reviewId}`,
        {
          rating: editRating,
          comment: editComment.trim(),
        }
      );

      // Refresh reviews
      const reviewsResponse = await API.get(
        `/api/reviews/product/${id}`
      );

      setReviews(reviewsResponse.data);

      // Refresh product rating/count
      const productResponse = await API.get(
        `/api/products/${id}`
      );

      setProduct(productResponse.data);

      // Exit edit mode
      setEditingReviewId(null);
      setEditRating(0);
      setEditComment("");

      setReviewMessage(
        "Review updated successfully! ⭐"
      );
    } catch (err) {
      console.error(
        "Update review error:",
        err
      );

      setReviewMessage(
        err.response?.data?.message ||
          "Unable to update review."
      );
    } finally {
      setEditSubmitting(false);
    }
  };

  // ========================================
  // DELETE REVIEW
  // ========================================

  const handleDeleteReview = async (
    reviewId
  ) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this review?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setReviewMessage("");

      await API.delete(
        `/api/reviews/${reviewId}`
      );

      // Refresh reviews
      const reviewsResponse = await API.get(
        `/api/reviews/product/${id}`
      );

      setReviews(reviewsResponse.data);

      // Refresh product rating/count
      const productResponse = await API.get(
        `/api/products/${id}`
      );

      setProduct(productResponse.data);

      // Exit edit mode if necessary
      setEditingReviewId(null);
      setEditRating(0);
      setEditComment("");

      setReviewMessage(
        "Review deleted successfully."
      );
    } catch (err) {
      console.error(
        "Delete review error:",
        err
      );

      setReviewMessage(
        err.response?.data?.message ||
          "Unable to delete review."
      );
    }
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

        {/* LEFT SIDE */}

        <div className="product-details-image-section">

          <div className="product-details-image-wrapper">

            <img
              src={product.image}
              alt={product.name}
              className="product-details-image"
            />

          </div>

        </div>


        {/* RIGHT SIDE */}

        <div className="product-details-info">

          {/* CATEGORY */}

          <p className="details-category">
            {product.category || "Featured"}
          </p>


          {/* PRODUCT NAME */}

          <h1>
            {product.name}
          </h1>


          {/* RATING */}

          <div className="details-rating">

            <span>
              ⭐{" "}
              {Number(
                product.rating || 0
              ).toFixed(1)}
            </span>

            <span>
              ({product.numReviews || 0} reviews)
            </span>

          </div>


          {/* PRICE */}

          <div className="details-price">

            ₹
            {Number(
              product.price
            ).toLocaleString("en-IN")}

          </div>


          {/* STOCK */}

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


          {/* DIVIDER */}

          <div className="details-divider"></div>


          {/* DESCRIPTION */}

          <div className="details-description">

            <h3>
              Description
            </h3>

            <p>
              {product.description ||
                "No description available for this product."}
            </p>

          </div>


          {/* ACTION BUTTONS */}

          <div className="details-actions">

            {/* CHAT WITH SELLER */}

            <button
              type="button"
              className="chat-seller-button"
              onClick={handleChatWithSeller}
            >
              💬 Chat with Seller
            </button>


            {/* WISHLIST */}

            <button
              type="button"
              className={`wishlist-details-button ${
                isWishlisted
                  ? "wishlisted"
                  : ""
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

        {/* =====================================
            CUSTOMER REVIEWS
        ====================================== */}

        <section className="product-reviews-section">

          {/* REVIEWS HEADER */}

          <div className="product-reviews-header">

            <div>

              <p className="details-category">
                CUSTOMER FEEDBACK
              </p>

              <h2>
                Customer Reviews
              </h2>

            </div>


            <div className="reviews-summary">

              <strong>
                ⭐{" "}
                {Number(
                  product.rating || 0
                ).toFixed(1)}
              </strong>

              <span>
                {product.numReviews || 0}{" "}
                {product.numReviews === 1
                  ? "Review"
                  : "Reviews"}
              </span>

            </div>

          </div>


          {/* REVIEWS LOADING */}

          {reviewsLoading && (
            <p className="reviews-status">
              Loading reviews...
            </p>
          )}


          {/* REVIEWS ERROR */}

          {reviewsError && (
            <p className="reviews-status error">
              {reviewsError}
            </p>
          )}


          {/* NO REVIEWS */}

          {!reviewsLoading &&
            !reviewsError &&
            reviews.length === 0 && (

              <div className="no-reviews">

                <div className="no-reviews-icon">
                  ⭐
                </div>

                <h3>
                  No reviews yet
                </h3>

                <p>
                  Be the first customer to
                  review this product.
                </p>

              </div>

            )}


          {/* =====================================
              WRITE A REVIEW
          ====================================== */}

          {user && (

            <div className="write-review-card">

              <h3>
                Write a Review
              </h3>

              <form
                onSubmit={
                  handleSubmitReview
                }
              >

                {/* RATING */}

                <div className="review-form-group">

                  <label>
                    Your Rating
                  </label>

                  <div className="star-rating">

                    {[1, 2, 3, 4, 5].map(
                      (star) => (

                        <button
                          key={star}
                          type="button"
                          className={
                            star <=
                            reviewRating
                              ? "star-button active"
                              : "star-button"
                          }
                          onClick={() =>
                            setReviewRating(
                              star
                            )
                          }
                        >
                          ★
                        </button>

                      )
                    )}

                  </div>

                </div>


                {/* COMMENT */}

                <div className="review-form-group">

                  <label>
                    Your Review
                  </label>

                  <textarea
                    value={reviewComment}
                    onChange={(e) =>
                      setReviewComment(
                        e.target.value
                      )
                    }
                    placeholder="Share your experience with this product..."
                    rows="4"
                    maxLength="500"
                  />

                </div>


                {/* MESSAGE */}

                {reviewMessage && (

                  <p className="review-form-message">
                    {reviewMessage}
                  </p>

                )}


                {/* SUBMIT */}

                <button
                  type="submit"
                  className="submit-review-button"
                  disabled={
                    reviewSubmitting
                  }
                >
                  {reviewSubmitting
                    ? "Submitting..."
                    : "Submit Review"}
                </button>

              </form>

            </div>

          )}


          {/* =====================================
              REVIEWS LIST
          ====================================== */}

          {!reviewsLoading &&
            reviews.length > 0 && (

              <div className="reviews-list">

                {reviews.map((review) => {

                  // =====================================
                  // LOGGED-IN USER ID
                  // Supports _id and id
                  // =====================================

                  const loggedInUserId =
                    getUserId(user);

                  // =====================================
                  // REVIEW OWNER ID
                  // =====================================

                  const reviewOwnerId =
                    getUserId(review.user);

                  // =====================================
                  // CHECK OWNERSHIP
                  // =====================================

                  const isOwnReview =
                    loggedInUserId &&
                    reviewOwnerId &&
                    String(loggedInUserId) ===
                      String(reviewOwnerId);

                  // =====================================
                  // CHECK EDIT MODE
                  // =====================================

                  const isEditing =
                    editingReviewId ===
                    review._id;

                  return (

                    <div
                      key={review._id}
                      className="review-card"
                    >

                      {/* =================================
                          REVIEW HEADER
                      ================================== */}

                      <div className="review-header">

                        {/* USER */}

                        <div className="review-user">

                          {review.user
                            ?.profileImage ? (

                            <img
                              src={
                                review.user
                                  .profileImage
                              }
                              alt={
                                review.user?.name ||
                                "User"
                              }
                              className="review-user-image"
                            />

                          ) : (

                            <div className="review-user-placeholder">
                              👤
                            </div>

                          )}


                          <div>

                            <strong>
                              {review.user?.name ||
                                "VendorVerse User"}
                            </strong>


                            {/* VERIFIED PURCHASE */}

                            {review.verifiedPurchase ===
                              true && (

                              <span className="verified-purchase">
                                ✓ Verified Purchase
                              </span>

                            )}


                            <small>
                              {new Date(
                                review.createdAt
                              ).toLocaleDateString()}
                            </small>

                          </div>

                        </div>


                        {/* =================================
                            RIGHT SIDE
                        ================================== */}

                        <div className="review-right">

                          {/* RATING */}

                          {!isEditing && (

                            <div className="review-rating">

                              {"⭐".repeat(
                                Number(
                                  review.rating
                                )
                              )}

                            </div>

                          )}


                          {/* =================================
                              EDIT / DELETE
                              ONLY OWNER
                          ================================== */}

                          {isOwnReview &&
                            !isEditing && (

                              <div className="review-actions">

                                <button
                                  type="button"
                                  className="edit-review-button"
                                  onClick={() =>
                                    handleEditReview(
                                      review
                                    )
                                  }
                                >
                                  ✏️ Edit
                                </button>


                                <button
                                  type="button"
                                  className="delete-review-button"
                                  onClick={() =>
                                    handleDeleteReview(
                                      review._id
                                    )
                                  }
                                >
                                  🗑️ Delete
                                </button>

                              </div>

                            )}

                        </div>

                      </div>


                      {/* =================================
                          EDIT REVIEW FORM
                      ================================== */}

                      {isEditing ? (

                        <div className="edit-review-form">

                          {/* EDIT RATING */}

                          <div className="review-form-group">

                            <label>
                              Your Rating
                            </label>

                            <div className="star-rating">

                              {[1, 2, 3, 4, 5].map(
                                (star) => (

                                  <button
                                    key={star}
                                    type="button"
                                    className={
                                      star <=
                                      editRating
                                        ? "star-button active"
                                        : "star-button"
                                    }
                                    onClick={() =>
                                      setEditRating(
                                        star
                                      )
                                    }
                                  >
                                    ★
                                  </button>

                                )
                              )}

                            </div>

                          </div>


                          {/* EDIT COMMENT */}

                          <div className="review-form-group">

                            <label>
                              Your Review
                            </label>

                            <textarea
                              value={
                                editComment
                              }
                              onChange={(e) =>
                                setEditComment(
                                  e.target.value
                                )
                              }
                              placeholder="Update your review..."
                              rows="4"
                              maxLength="500"
                            />

                          </div>


                          {/* EDIT ACTIONS */}

                          <div className="review-edit-actions">

                            <button
                              type="button"
                              className="save-review-button"
                              onClick={() =>
                                handleUpdateReview(
                                  review._id
                                )
                              }
                              disabled={
                                editSubmitting
                              }
                            >
                              {editSubmitting
                                ? "Saving..."
                                : "💾 Save Changes"}
                            </button>


                            <button
                              type="button"
                              className="cancel-review-button"
                              onClick={
                                handleCancelEdit
                              }
                              disabled={
                                editSubmitting
                              }
                            >
                              Cancel
                            </button>

                          </div>

                        </div>

                      ) : (

                        /* =================================
                            NORMAL COMMENT
                        ================================== */

                        <p className="review-comment">
                          {review.comment}
                        </p>

                      )}

                    </div>

                  );

                })}

              </div>

            )}

        </section>


        {/* =====================================
            PRODUCT DESCRIPTION
        ====================================== */}

        <div className="extra-card">

          <h2>
            Product Description
          </h2>

          <p>
            {product.description ||
              "No additional description available."}
          </p>

        </div>


        {/* =====================================
            SELLER INFORMATION
        ====================================== */}

        <div className="extra-card">

          <h2>
            Seller Information
          </h2>

          <p>
            Seller:{" "}
            <strong>
              {product.seller?.name ||
                "Vendor"}
            </strong>
          </p>

          {product.seller?.email && (

            <p>
              {product.seller.email}
            </p>

          )}

        </div>


        {/* =====================================
            SPECIFICATIONS
        ====================================== */}

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