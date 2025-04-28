import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from './CartContext'; // Import CartContext if you use it

function WishlistPage() {
    const [wishlistItems, setWishlistItems] = useState([]);
    const navigate = useNavigate();
    const { addItemToCart } = useCart(); // Use CartContext
    const userId = localStorage.getItem('userId'); // Assuming you store userId in localStorage
    const token = localStorage.getItem('token'); // Assuming you store the token

    useEffect(() => {
        if (userId && token) {
            fetch(`https://localhost:7046/api/WishList/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            })
                .then((res) => res.json())
                .then((products) => setWishlistItems(products))
                .catch((error) => console.error("Error fetching wishlist items:", error));
        } else if (!localStorage.getItem('token')) {
            navigate('/login');
        }
    }, [userId, token, navigate]);

    const removeFromWishlist = async (productId) => {
        if (!userId || !token) {
            navigate('/login');
            return;
        }

        try {
            const response = await fetch(`https://localhost:7046/api/WishList/${userId}/remove/${productId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                // Update the local state to re-render the wishlist
                setWishlistItems(wishlistItems.filter((item) => item.productId !== productId));
            } else {
                console.error("Error removing from wishlist:", response.status);
                // Optionally show an error notification
            }
        } catch (error) {
            console.error("Error removing from wishlist:", error);
            // Optionally show an error notification
        }
    };

    const handleAddToCart = async (product) => {
        if (!localStorage.getItem('token')) {
            navigate('/login');
            return;
        }
        try {
            const success = await addItemToCart(product.productId, 1);
            if (success) {
                // Optionally show a notification
                console.log(`${product.productName} added to cart from wishlist`);
                // If successfully added to cart, remove from wishlist
                await removeFromWishlist(product.productId);
            } else {
                console.error('Failed to add item to cart from wishlist');
                // Optionally show an error notification
            }
        } catch (error) {
            console.error(`Error adding product ${product.productId} to cart from wishlist:`, error);
            // Optionally show an error notification
        }
    };

    const getRatingClass = (rating) => {
        if (rating > 4) return "rating-good";
        if (rating >= 3 && rating <= 4) return "rating-ok";
        return "rating-bad";
    };

    if (wishlistItems.length === 0) {
        return (
            <div className="wishlist-page">
                <h2 className="wishlist-empty-message">Your wishlist is currently empty.</h2>
            </div>
        );
    }

    return (
        <div className="wishlist-page">
            <h1 className="wishlist-title">My Wishlist</h1>
            <div className="product-grid">
                {wishlistItems.map((product) => (
                    <div key={product.productId} className="product-item">
                        <Link to={`/product/${product.productId}`}>
                            <img
                                src={product.imgurl}
                                alt={product.productName}
                                className="product-item-image"
                            />
                            <h3>{product.productName}</h3>
                            <h4>₹{product.price}</h4>
                            <p className={`product-card-rating ${getRatingClass(product.averageRating)}`}>
                                {product.averageRating ? product.averageRating.toFixed(1) : "N/A"}
                                {product.averageRating && <span className="star">★</span>}
                            </p>
                        </Link>
                        <div className="controls">
                            <button onClick={() => handleAddToCart(product)} className="add-to-cart-button">
                                Add to Cart
                            </button>
                            <span
                                className="wishlist-icon"
                                onClick={() => removeFromWishlist(product.productId)}
                            >
                                ❤️ {/* Always show filled heart on wishlist page, clicking removes */}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default WishlistPage;
