import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from './CartContext';
import './CSS/Cart.css';

const Cart = () => {
  const { cartItems, totalAmount, loading, updateItemQuantity, removeItem } = useCart();
  const navigate = useNavigate();

  // Handle checkout button click
  const handleCheckout = () => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    
    if (!token || !userId) {
      alert('Please log in to proceed to checkout.');
      navigate('/login');
      return;
    }
    
    // Check if cart is empty
    if (cartItems.length === 0) {
      alert('Your cart is empty. Please add items before checkout.');
      return;
    }
    
    // Proceed to checkout page
    navigate('/checkout');
  };

  if (loading) return <div className="loading">Loading cart...</div>;

  return (
    <div className="cart-container">
      <h1>Your Cart</h1>
      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <p>Your cart is empty.</p>
          <button className="shop-now-btn" onClick={() => navigate('/home')}>Shop Now</button>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item.cartItemId} className="cart-item">
                <div className="item-image">
                  <img src={item.product?.imgurl} alt={item.product?.productName} />
                </div>
                <div className="item-details">
                  <h3>{item.product?.productName}</h3>
                  <p className="item-price">₹{item.product?.price*item.quantity}</p>
                </div>
                <div className="item-actions">
                  <div className="quantity-controls">
                    <button onClick={() => updateItemQuantity(item.cartItemId, item.quantity - 1)}>-</button>
                    <span className="quantity">{item.quantity}</span>
                    <button onClick={() => updateItemQuantity(item.cartItemId, item.quantity + 1)}>+</button>
                  </div>
                  <button className="remove-btn" onClick={() => removeItem(item.cartItemId)}>Remove</button>
                </div>
                <div className="item-total">
                  <p>₹{item.totalPrice || (item.product?.price * item.quantity)}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="cart-summary">
            <div className="cart-total">
              <h3>Cart Total</h3>
              <p className="total-amount">₹{totalAmount}</p>
            </div>
            <button className="checkout-btn" onClick={handleCheckout}>Proceed to Checkout</button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;