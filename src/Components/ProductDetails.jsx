import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./CSS/ProductDetail.css";

function ProductDetail() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [canRate, setCanRate] = useState(false);
  const [showRatingForm, setShowRatingForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [error, setError] = useState("");

  const userId = localStorage.getItem("userId"); // Get userId

  useEffect(() => {
    fetch(`https://localhost:7046/api/Product/${productId}`)
      .then((response) => response.json())
      .then((data) => setProduct(data))
      .catch((error) =>
        console.error("Error fetching product details:", error)
      );

    fetch(`https://localhost:7046/api/Review/product/${productId}`)
      .then((response) => response.json())
      .then((data) => setReviews(data))
      .catch((error) => console.error("Error fetching reviews:", error));
  }, [productId]);

  // Order history: can the user rate?
  useEffect(() => {
    if (!userId) {
      setCanRate(false);
      return;
    }
    fetch(`https://localhost:7046/api/Order/user/${userId}`)
      .then(res => res.json())
      .then(orders => {
        // Each order: { orderId, items: [{ productId, ... }, ...] }
        const allOrders = Array.isArray(orders) ? orders : [orders];
        const purchased = allOrders.some(order =>
          (order.orderItems_ || []).some(
            item => Number(item.productId) === Number(productId)
          )
        );
        setCanRate(purchased);
      })
      .catch(() => setCanRate(false));
  }, [productId, userId]);

  const handleCloseRatingForm = () => {
    setShowRatingForm(false);
    setRating(5);
    setReviewText("");
    setError("");
  };

  const handleRatingSubmit = (e) => {
    e.preventDefault();
    setError("");
    fetch("https://localhost:7046/api/Review", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization': 'Bearer ' + localStorage.getItem('token'), // If you use JWT, enable this
      },
      body: JSON.stringify({
        productId: Number(productId),
        rating: Number(rating),
        reviewText: reviewText,
        // userId: ... (If needed, get from authentication)
      }),
    })
      .then((res) => {
        if (res.status === 403)
          throw new Error("You are not allowed to rate this product.");
        if (!res.ok) throw new Error("Review Already Submiited For this Product... Happy Shopping");
        return res.json();
      })
      .then(() => {
        handleCloseRatingForm();
        // refresh reviews on success
        fetch(`https://localhost:7046/api/Review/product/${productId}`)
          .then((response) => response.json())
          .then((data) => setReviews(data));
      })
      .catch((err) => {
        setError(err.message);
      });
  };

  if (!product) {
    return <div>Loading...</div>;
  }
  return (
    <div className="product-detail">
      <div className="product-detail-container">
        <div className="product-image-container">
          <img
            src={product.imgurl}
            alt={product.productName}
            className="product-image"
          />
        </div>
        <div className="product-info">
          <h2>{product.productName}</h2>
          <h4>Price: ₹{product.price}</h4>
          <p>{product.desc}</p>

          <p>Category: {product.categoryName}</p>
          <p>
            Rating:{" "}
            {product.averageRating ? product.averageRating.toFixed(1) : "N/A"} /
            5
          </p>
          <button className="add-to-cart">Add to Cart</button>
        </div>
        <div className="product-reviews">
          <h3>
            Rating:{" "}
            {product.averageRating ? product.averageRating.toFixed(1) : "N/A"} /
            5
          </h3>
          <div className="reviews-header">
            <h3>Reviews</h3>
          </div>

          <div className="reviews-container">
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <div key={review.reviewId} className="review">
                  <div className="review-header">
                    <div className={`rating-box rating-${review.rating}`}>
                      {review.rating} ★
                    </div>
                    <strong className="review-text">{review.reviewText}</strong>
                  </div>
                  <p>
                    {review.userName} -{" "}
                    {new Date(review.postedDate).toLocaleDateString()}
                  </p>
                </div>
              ))
            ) : (
              <p>No reviews yet.</p>
            )}
          </div>
        </div>
        <div className="rate-product-section">
          {canRate ? (
            <button
              className="rate-product-button"
              onClick={() => setShowRatingForm(true)}
            >
              Rate Product
            </button>
          ) : (
            <button
              className="rate-product-button"
              disabled
              title="Only users who purchased this product can rate it."
            >
              Rate Product
            </button>
          )}
        </div>
        {showRatingForm && (
          <div className="review-modal-overlay" onClick={handleCloseRatingForm}>
            <div className="review-modal" onClick={(e) => e.stopPropagation()}>
              <form onSubmit={handleRatingSubmit} className="review-form">
                <h4>Rate this Product</h4>
                <label>
                  Rating:
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    required
                  />
                </label>
                <br />
                <label>
                  Review:
                  <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    required
                  />
                </label>
                <br />
                <button type="submit">Submit Review</button>
                <button type="button" onClick={handleCloseRatingForm}>
                  Cancel
                </button>
                {error && <p className="error">{error}</p>}
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductDetail;