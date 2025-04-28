import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from './CartContext';
import './CSS/Checkout.css';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, totalAmount, loading, checkoutProcessing, processCheckout } = useCart();
  const [shippingAddress, setShippingAddress] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('completed');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Check if user is logged in and cart has items
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    
    if (!token || !userId) {
      navigate('/login');
      return;
    }
    
    if (!loading && cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems, loading, navigate]);

  const handlePaymentStatusChange = (event) => {
    setPaymentStatus(event.target.value);
  };

  const handleAddressChange = (event) => {
    setShippingAddress(event.target.value);
  };

  const validateShippingAddress = () => {
    if (!shippingAddress.trim()) {
      setError('Please enter a shipping address');
      return false;
    }
    if (shippingAddress.length > 200) {
      setError('Shipping address exceeds 200 characters');
      return false;
    }
    return true;
  };

  const placeOrder = async () => {
    if (!validateShippingAddress()) {
      return;
    }

    setError(null);
    
    // Process checkout using the context function
    const result = await processCheckout(shippingAddress, paymentStatus);
    
    if (result.success) {
      // Show success message
      setSuccessMessage(result.message);
      
      // Hide success message after 2 seconds and navigate to home
      setTimeout(() => {
        navigate('/home', { 
          state: { orderSuccess: true, message: result.message } 
        });
      }, 2000);
    } else {
      setError(result.message);
    }
  };

  if (loading) {
    return <div className="loading">Loading checkout details...</div>;
  }

  if (error) {
    return (
      <div className="checkout-container">
        <div className="error-message">{error}</div>
        <button onClick={() => setError(null)} className="back-button">
          Try Again
        </button>
        <button onClick={() => navigate('/cart')} className="back-button">
          Return to Cart
        </button>
      </div>
    );
  }

  if (successMessage) {
    return (
      <div className="checkout-container">
        <div className="success-message">
          <h2>{successMessage}</h2>
          <p>Redirecting to home page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <h1 className="checkout-header">Checkout</h1>
      
      <div className="checkout-sections">
        <div className="order-summary-section">
          <h2>Order Summary</h2>
          <div className="order-items">
            {cartItems.map(item => (
              <div key={item.cartItemId} className="order-item">
                <div className="order-item-image">
                  {item.product?.imgurl && (
                    <img
                      src={item.product.imgurl}
                      alt={item.product?.productName}
                      className="product-image"
                    />
                  )}
                </div>
                <div className="order-item-details">
                  <h3>{item.product?.productName}</h3>
                  <p>Quantity: {item.quantity}</p>
                  <p className="item-price">₹{item.totalPrice || (item.product?.price * item.quantity)}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="order-totals">
            <p>Subtotal: ₹{totalAmount?.toFixed(2) || '0.00'}</p>
            <p>Shipping Cost: ₹0.00</p>
            <p className="total-amount">Total Amount: ₹{totalAmount?.toFixed(2) || '0.00'}</p>
          </div>
        </div>
        
        <div className="checkout-form-section">
          <div className="shipping-address">
            <h2>Shipping Address</h2>
            <textarea 
              name="shippingAddress" 
              placeholder="Enter full shipping address, Maximum 200 characters" 
              value={shippingAddress} 
              onChange={handleAddressChange} 
              rows="4" 
              cols="50" 
              maxLength="200" 
              required 
            />
            <div className="char-count">{shippingAddress.length}/200 characters</div>
          </div>
          
          <div className="payment-status">
            <h2>Payment Status</h2>
            <select 
              value={paymentStatus} 
              onChange={handlePaymentStatusChange} 
              className="payment-dropdown"
            >
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="checkout-actions">
        <button onClick={() => navigate('/cart')} className="back-button">
          Back to Cart
        </button>
        
        <button
          onClick={placeOrder}
          disabled={checkoutProcessing}
          className="place-order-button"
        >
          {checkoutProcessing ? 'Processing...' : 'Place Order'}
        </button>
      </div>
    </div>
  );
};

export default Checkout;