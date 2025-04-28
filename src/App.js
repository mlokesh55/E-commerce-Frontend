import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { SearchProvider } from './Components/SearchContext';
import { CartProvider } from './Components/CartContext';

// Component Imports
import Register from './Components/Register';
import Login from './Components/Login';
import Navbar from './Components/Navbar';
import Home from './Components/Home';
import Cart from './Components/Cart';
import Checkout from './Components/Checkout';
import Orders from './Components/Orders';
import OrderDetails from './Components/OrderDetails';
import About from './Components/About';
import UserProfile from './Components/UserProfile';
import Wishlist from './Components/Wishlist';
import ForgotPassword from './Components/ForgotPassword';
import AdminLayout from './Components/Admin/AdminLayout';
import AdminDashboard from './Components/Admin/AdminDashboard';
import AdminProducts from './Components/Admin/AdminProducts';
import ProductDetails from './Components/ProductDetails';
import UserList from './Components/Admin/UserList';
import { Contact } from './Components/Contact';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      setIsLoggedIn(!!token);
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  const Layout = ({ children }) => (
    <>
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <div className="main-content">{children}</div>
    </>
  );

  const ProtectedRoute = ({ children }) => {
    if (isLoading)
      return (
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      );

    const token = localStorage.getItem('token');
    if (!token) return <Navigate to="/login" replace />;

    return <Layout>{children}</Layout>;
  };

  return (
    <SearchProvider>
      <CartProvider>
        <Router>
          <div className="app-container">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Navigate to="/home" />} />
              <Route path="/home" element={<Layout><Home /></Layout>} />
              <Route path="/login" element={<Login onLogin={() => setIsLoggedIn(true)} />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/product/:productId" element={<Layout><ProductDetails /></Layout>} />

              {/* Admin Routes */}
              <Route path="/admin-panel" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
              <Route path="/admin-panel/products" element={<AdminLayout><AdminProducts /></AdminLayout>} />
              <Route path="/admin-panel/users" element={<AdminLayout><UserList /></AdminLayout>} />

              {/* Protected Routes */}
              <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
              <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
              <Route path="/Orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />    //orders
              <Route path="/order/:orderId" element={<ProtectedRoute><OrderDetails /></ProtectedRoute>} />
              <Route path="/about" element={<ProtectedRoute><About /></ProtectedRoute>} />
              <Route path="/contact" element={<ProtectedRoute><Contact /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
              <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />

              {/* Optional: 404 Page */}
              {/* <Route path="*" element={<div className="error-page"><h1>404 - Page Not Found</h1><p>The page you're looking for doesn't exist.</p><button onClick={() => window.history.back()} className="back-button">Go Back</button></div>} /> */}
            </Routes>
          </div>
        </Router>
      </CartProvider>
    </SearchProvider>
  );
}

export default App;










