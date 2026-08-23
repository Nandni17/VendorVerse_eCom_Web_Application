import { Star } from "../icons";

function Rating({ rating, reviews }) {
  // =========================
  // NEW PRODUCT
  // =========================

  if (!rating || Number(rating) <= 0) {
    return (
      <div className="rating new-product">
        <span>New product</span>
      </div>
    );
  }

  const roundedRating = Math.round(Number(rating));

  return (
    <div className="rating">

      {/* =========================
          STARS
      ========================= */}

      <div className="stars">

        {[1, 2, 3, 4, 5].map((star) => (

          <Star
            key={star}
            size={16}
            strokeWidth={1.8}
            className={
              star <= roundedRating
                ? "star active"
                : "star"
            }
            fill={
              star <= roundedRating
                ? "currentColor"
                : "none"
            }
          />

        ))}

      </div>


      {/* =========================
          RATING NUMBER
      ========================= */}

      <span className="rating-number">
        {Number(rating).toFixed(1)}
      </span>


      {/* =========================
          REVIEW COUNT
      ========================= */}

      {reviews !== undefined && (
        <span className="review-count">
          ({reviews})
        </span>
      )}

    </div>
  );
}

export default Rating;