import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./CSS/ProductDetail.css";
 
function ProductDetail() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
 
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
        <button className="rate-product-button">Rate Product</button>
      </div>
    </div>
  );
}
 
export default ProductDetail;
 
 