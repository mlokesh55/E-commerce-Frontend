import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCartItems, addToCart, updateCartItem, removeCartItem, checkoutCart } from '../Api';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [checkoutProcessing, setCheckoutProcessing] = useState(false);
  
  // Get userId from localStorage instead of hardcoding
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (userId) {
      fetchCart();
    }
  }, [userId]);

  useEffect(() => {
    // Update cart count
    const count = cartItems.reduce((total, item) => total + item.quantity, 0);
    setCartCount(count);
    
    // Update total amount
    const amount = cartItems.reduce((total, item) => {
      return total + (item.totalPrice || (item.product?.price * item.quantity) || 0);
    }, 0);
    setTotalAmount(amount);
  }, [cartItems]);

  const fetchCart = async () => {
    if (!localStorage.getItem('token') || !userId) return;
    
    try {
      setLoading(true);
      const data = await getCartItems(userId);
      setCartItems(data);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const addItemToCart = async (productId, quantity = 1) => {
    if (!localStorage.getItem('token') || !userId) return false;
    
    try {
      setLoading(true);
      await addToCart(userId, productId, quantity);
      await fetchCart(); // Refresh cart
      return true;
    } catch (error) {
      console.error('Error adding item to cart:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

//cartupdate
  const updateItemQuantity = async (cartItemId, quantity) => {
    if (!localStorage.getItem('token') || !userId) return false;
    
    try {
      setLoading(true);
      if (quantity <= 0) {
        await removeCartItem(cartItemId);
      } else {
        await updateCartItem(cartItemId, quantity);
      }
      await fetchCart(); // Refresh cart
      return true;
    } catch (error) {
      console.error('Error updating cart item:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };
  
//cartremove
  const removeItem = async (cartItemId) => {
    if (!localStorage.getItem('token') || !userId) return false;
    
    try {
      setLoading(true);
      await removeCartItem(cartItemId);
      await fetchCart(); // Refresh cart
      return true;
    } catch (error) {
      console.error('Error removing item from cart:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  
  const clearCart = () => {
    setCartItems([]);
    setCartCount(0);
    setTotalAmount(0);
  };

  // New function to handle checkout process
  const processCheckout = async (shippingAddress, paymentStatus) => {
    if (!localStorage.getItem('token') || !userId) return { success: false, message: 'User not authenticated' };
    if (cartItems.length === 0) return { success: false, message: 'Cart is empty' };
    
    try {
      setCheckoutProcessing(true);
      // Call the checkout API
      await checkoutCart(userId, shippingAddress, paymentStatus);
      
      // Clear cart after successful checkout
      clearCart();
      
      return { success: true, message: 'Order placed successfully!' };
    } catch (error) {
      console.error('Error during checkout process:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to process order. Please try again.' 
      };
    } finally {
      setCheckoutProcessing(false);
    }
  };

  return (
    <CartContext.Provider 
      value={{ 
        cartItems, 
        cartCount, 
        totalAmount, 
        loading,
        checkoutProcessing,
        addItemToCart, 
        updateItemQuantity, 
        removeItem, 
        clearCart,
        processCheckout
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;