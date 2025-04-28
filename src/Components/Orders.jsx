// import React, { useState } from 'react';
// import OrderList from './OrderList';
// import OrderDetails from './OrderDetails';
// // import './Orders.css'; // Make sure to create this CSS file

// const Orders = () => {
//   const [selectedOrderId, setSelectedOrderId] = useState(null);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [searchError, setSearchError] = useState('');

//   const handleSearch = () => {
//     if (!searchQuery.trim()) {
//       setSearchError('Please enter an order ID');
//       return;
//     }
    
//     setSearchError('');
//     setSelectedOrderId(searchQuery);
//   };

//   const handleClearSearch = () => {
//     setSearchQuery('');
//     setSearchError('');
//     setSelectedOrderId(null);
//   };

//   return (
//     <div className="orders-container">
//       {selectedOrderId ? (
//         <OrderDetails orderId={selectedOrderId} onBack={handleClearSearch} />
//       ) : (
//         <div>
//           <h1 className="orders-title">My Orders</h1>
//           <div className="search-container">
//             <input
//               type="text"
//               placeholder="Search by order ID..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="search-input"
//             />
//             <button onClick={handleSearch} className="search-button">Search</button>
//             {searchError && <p className="search-error">{searchError}</p>}
//           </div>
//           <OrderList onSelectOrder={setSelectedOrderId} />
//         </div>
//       )}
//     </div>
//   );
// };

// export default Orders;




// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import './Orders.css';

// const API_URL = 'https://localhost:7046/api';

// // New API function to get all orders for a user
// const getUserOrders = async (userId) => {
//   try {
//     const response = await axios.get(`${API_URL}/Order/user/${userId}`);
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching user orders:', error);
//     throw error;
//   }
// };

// const Orders = () => {
//   const navigate = useNavigate();
//   const [orders, setOrders] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
  
//   // Get userId from localStorage
//   const userId = localStorage.getItem('userId');

//   useEffect(() => {
//     if (!userId) {
//       setError("Please login to view your orders");
//       setIsLoading(false);
//       return;
//     }
    
//     fetchUserOrders();
//   }, [userId]);

//   const fetchUserOrders = async () => {
//     try {
//       const data = await getUserOrders(userId);
//       setOrders(data);
//       setIsLoading(false);
//     } catch (error) {
//       console.error('Error fetching orders:', error);
//       setError("Failed to load orders. Please try again.");
//       setIsLoading(false);
//     }
//   };

//   const getOrderStatusLabel = (code) => {
//     const statuses = {
//       1: 'Pending',
//       2: 'Processing',
//       3: 'Shipped',
//       4: 'Delivered',
//       5: 'Cancelled'
//     };
//     return statuses[code] || 'Unknown';
//   };

//   const getPaymentStatusLabel = (code) => {
//     const statuses = {
//       1: 'Pending',
//       2: 'Completed',
//       3: 'Failed'
//     };
//     return statuses[code] || 'Unknown';
//   };

//   if (isLoading) {
//     return <div className="loading">Loading your orders...</div>;
//   }

//   if (error) {
//     return (
//       <div className="error-container">
//         <div className="error-message">{error}</div>
//         <button className="back-button" onClick={() => navigate('/home')}>
//           Back to Home
//         </button>
//       </div>
//     );
//   }

//   if (orders.length === 0) {
//     return (
//       <div className="orders-container">
//         <h1 className="orders-header">My Orders</h1>
//         <div className="no-orders">
//           <p>You haven't placed any orders yet.</p>
//           <button onClick={() => navigate('/home')} className="shop-now-button">
//             Shop Now
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="orders-container">
//       <h1 className="orders-header">My Orders</h1>
      
//       <div className="orders-list">
//         {orders.map(order => (
//           <div key={order.orderId} className="order-card">
//             <div className="order-header">
//               <div className="order-id">
//                 <span>Order #:</span> {order.orderId}
//               </div>
//               <div className="order-date">
//                 <span>Date:</span> {new Date(order.orderDate).toLocaleDateString()}
//               </div>
//             </div>
            
//             <div className="order-info">
//               <div className="order-status">
//                 <span>Status:</span> 
//                 <span className={`status-badge status-${getOrderStatusLabel(order.orderStatus).toLowerCase()}`}>
//                   {getOrderStatusLabel(order.orderStatus)}
//                 </span>
//               </div>
//               <div className="payment-status">
//                 <span>Payment:</span>
//                 <span className={`payment-badge payment-${getPaymentStatusLabel(order.paymentStatus).toLowerCase()}`}>
//                   {getPaymentStatusLabel(order.paymentStatus)}
//                 </span>
//               </div>
//               <div className="order-total">
//                 <span>Total:</span> ₹{order.totalAmount?.toFixed(2) || '0.00'}
//               </div>
//             </div>
            
//             <div className="order-actions">
//               <Link to={`/order/${order.orderId}`} className="view-details-button">
//                 View Details
//               </Link>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Orders;

// Orders.jsx
  import React, { useState, useEffect } from 'react';
  import { useNavigate } from 'react-router-dom';
  import { getUserOrders } from '../Api';
  import './CSS/Orders.css';

  const Orders = () => {
    const navigate = useNavigate();
    const [orders,   setOrders]   = useState([]);
    const [loading,  setLoading]  = useState(true);
    const [error,    setError]    = useState('');
    const userId = localStorage.getItem('userId');
    const token  = localStorage.getItem('token');

    useEffect(() => {
      // 1) if not logged in, force to logins
      console.log('Token:', localStorage.getItem('token'));  //added new
      if (!token || !userId) {
        navigate('/login');
        return;
      }

      // 2) otherwise, fetch orders
      fetchUserOrders();
    }, [token, userId, navigate]);

    const fetchUserOrders = async () => {
      try {
        setLoading(true);
        const data = await getUserOrders(userId);
        setOrders(data);
      } catch (err) {
        console.error(err);
        setError('Failed to load your orders. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (loading) return <div className="loading">Loading your orders…</div>;
    if (error)   return (
      <div className="error-container">
        <p className="error">{error}</p>
        <button onClick={() => navigate('/home')}>Back to Home</button>
      </div>
    );

    if (orders.length === 0) return (
      <div className="orders-container">
        <h1>My Orders</h1>
        <p>You haven't placed any orders yet.</p>
        <button onClick={() => navigate('/home')}>Shop Now</button>
      </div>
    );

    return (
      <div className="orders-container">
        <h1>My Orders</h1>
        <div className="orders-list">
          {orders.map(order => (
            <div 
              key={order.orderId} 
              className="order-card"
              onClick={() => navigate(`/order/${order.orderId}`)}
            >
              <div className="order-id">Order #{order.orderId}</div>
              <div className="order-date">Date: {new Date(order.orderDate).toLocaleDateString()}</div>
              <div className="order-total">Total: ₹{order.totalAmount?.toFixed(2)}</div>
              <div className="order-status">Status: {order.orderStatus}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  export default Orders;

  