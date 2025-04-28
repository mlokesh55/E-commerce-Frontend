import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSearch } from './SearchContext';
import { useCart } from './CartContext';
import "./CSS/Home.css";

function Home() {
    const [products, setProducts] = useState([]);
    const [isAdding, setIsAdding] = useState({});
    const [notification, setNotification] = useState(null);
    const [wishlist, setWishlist] = useState([]); // Store wishlist IDs fetched from the backend
    const navigate = useNavigate();
    const { searchTerm, selectedCategory, setSelectedCategory } = useSearch();
    const { addItemToCart } = useCart();
    const userId = localStorage.getItem('userId'); // Assuming you store userId in localStorage

    useEffect(() => {
        fetch("https://localhost:7046/api/Product")
            .then((response) => response.json())
            .then((data) => setProducts(data))
            .catch((error) => console.error("Error fetching products:", error));

        // Fetch user's wishlist on component mount if logged in
        if (userId) {
            fetch(`https://localhost:7046/api/WishList/${userId}`)
                .then(response => response.json())
                .then(wishlistProducts => {
                    // Extract product IDs from the wishlist products
                    const wishlistProductIds = wishlistProducts.map(product => product.productId);
                    setWishlist(wishlistProductIds);
                })
                .catch(error => console.error("Error fetching wishlist:", error));
        }
    }, [userId]); // Re-fetch wishlist if userId changes (e.g., user logs in/out)

    const handleProductClick = (productId) => {
        navigate(`/product/${productId}`);
    };

    const handleCategoryChange = (event) => {
        setSelectedCategory(event.target.value);
    };

    const handleAddToCart = async (product) => {
        if (!localStorage.getItem('token')) {
            navigate('/login');
            return;
        }

        setIsAdding(prev => ({ ...prev, [product.productId]: true }));

        try {
            const success = await addItemToCart(product.productId, 1);

            if (success) {
                setNotification(`${product.productName} added to cart`);
                setTimeout(() => setNotification(null), 3000);
            } else {
                setNotification('Failed to add item to cart');
                setTimeout(() => setNotification(null), 3000);
            }
        } catch (error) {
            console.error(`Error adding product ${product.productId} to cart:`, error);
            setNotification('Failed to add item to cart');
            setTimeout(() => setNotification(null), 3000);
        } finally {
            setIsAdding(prev => ({ ...prev, [product.productId]: false }));
        }
    };

    const toggleWishlist = async (productId) => {
        if (!localStorage.getItem('token')) {
            navigate('/login');
            return;
        }

        const isAlreadyInWishlist = wishlist.includes(productId);
        const apiUrl = `https://localhost:7046/api/WishList/${userId}/${isAlreadyInWishlist ? 'remove' : 'add'}/${productId}`;
        const method = isAlreadyInWishlist ? 'DELETE' : 'POST';

        try {
            const response = await fetch(apiUrl, {
                method: method,
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`, // Include your auth token
                },
            });

            if (response.ok) {
                // Update local wishlist state on successful API call
                if (isAlreadyInWishlist) {
                    setWishlist(wishlist.filter(id => id !== productId));
                } else {
                    setWishlist([...wishlist, productId]);
                }
            } else {
                console.error(`Failed to ${isAlreadyInWishlist ? 'remove from' : 'add to'} wishlist`, response.status);
                // Optionally show an error notification
            }
        } catch (error) {
            console.error(`Error ${isAlreadyInWishlist ? 'removing from' : 'adding to'} wishlist:`, error);
            // Optionally show an error notification
        }
    };

    const filteredProducts = products.filter((product) => {
        return (
            product.productName.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (selectedCategory === "All" || product.categoryName === selectedCategory)
        );
    });

    const getRatingClass = (rating) => {
        if (rating > 4) return "rating-good";
        if (rating >= 3 && rating <= 4) return "rating-ok";
        return "rating-bad";
    };

    const isProductInWishlist = (productId) => {
        return wishlist.includes(productId);
    };

    return (
        <div className="product-list">
            <h1>Product List</h1>
            <select value={selectedCategory} onChange={handleCategoryChange} className="category-filter">
                <option value="All">All</option>
                <option value="Mobile">Mobile</option>
                <option value="Books">Books</option>
                <option value="Shoes">Shoes</option>
                <option value="Sports">Sports</option>
            </select>

            {notification && <div className="notification">{notification}</div>}

            {filteredProducts.length === 0 ? (
                <div className="no-results">No products found</div>
            ) : (
                <div className="product-grid">
                    {filteredProducts.map((product) => (
                        <div key={product.productId} className="product-item">
                            <Link to={`/product/${product.productId}`}>
                                <img
                                    src={product.imgurl}
                                    alt={product.productName}
                                    onClick={() => handleProductClick(product.productId)}
                                />
                            </Link>
                            <h3>{product.productName}</h3>
                            <h4>₹{product.price}</h4>
                            <p className={`product-card-rating ${getRatingClass(product.averageRating)}`}>
                                {product.averageRating ? product.averageRating.toFixed(1) : "N/A"}
                                {product.averageRating && <span className="star">★</span>}
                            </p>

                            <div className="controls">
                                <button
                                    onClick={() => handleAddToCart(product)}
                                    disabled={isAdding[product.productId]}
                                    className={`product-item button ${isAdding[product.productId] ? "adding" : ""}`}
                                >
                                    {isAdding[product.productId] ? 'Adding...' : 'Add to Cart'}
                                </button>
                                <span
                                    className="wishlist-icon"
                                    onClick={() => toggleWishlist(product.productId)}
                                >
                                    {isProductInWishlist(product.productId) ? "❤️" : "🤍"}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Home;