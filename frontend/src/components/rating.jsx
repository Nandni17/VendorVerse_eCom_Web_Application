function Rating({ rating, reviews }) {
  // Don't show fake ratings if the backend doesn't have them
  if (!rating) {
    return (
      <div className="rating new-product">
        <span>New product</span>
      </div>
    );
  }

  const roundedRating = Math.round(rating);

  return (
    <div className="rating">

      <div className="stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={star <= roundedRating ? "star active" : "star"}
          >
            ★
          </span>
        ))}
      </div>

      <span className="rating-number">
        {Number(rating).toFixed(1)}
      </span>

      {reviews !== undefined && (
        <span className="review-count">
          ({reviews})
        </span>
      )}

    </div>
  );
}

export default Rating;