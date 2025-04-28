// import React, { useState, useEffect } from 'react';
// // import './OrderList.css'; // Make sure to create this CSS file
// import { getUserOrders } from '../Api';

// const OrderList = ({ onSelectOrder }) => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Get userId from localStorage
//   const userId = localStorage.getItem('userId');

//   useEffect(() => {
//     console.log('Token:', localStorage.getItem('token')); //added new
//     const fetchOrders = async () => {
//       if (!userId) {
//         setError("User not logged in");
//         setLoading(false);
//         return;
//       }

//       try {
//         setLoading(true);
//         const response = await fetch(`https://localhost:7046/api/Order/user/${userId}`);
        
//         if (!response.ok) {
//           throw new Error(`Error fetching orders: ${response.statusText}`);
//         }
        
//         const data = await response.json();
        
//         if (Array.isArray(data)) {
//           // Sort orders by date (newest first)
//           const sortedOrders = data.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
//           setOrders(sortedOrders);
//         } else {
//           console.error('Unexpected response format:', data);
//           setError('Invalid data format received from server');
//         }
        
//         setLoading(false);
//       } catch (error) {
//         console.error('Error fetching orders:', error);
//         setError('Failed to load orders. Please try again later.');
//         setLoading(false);
//       }
//     };

//     fetchOrders();
//   }, [userId]);

//   if (loading) {
//     return <div className="loading">Loading your orders...</div>;
//   }

//   if (error) {
//     return <div className="error-message">{error}</div>;
//   }

//   if (orders.length === 0) {
//     return (
//       <div className="no-orders">
//         <h2>No Orders Found</h2>
//         <p>You haven't placed any orders yet.</p>
//       </div>
//     );
//   }

//   return (
//     <div className="order-list">
//       <h2>Your Orders</h2>
//       <div className="orders-grid">
//         {orders.map(order => (
//           <div key={order.orderId} className="order-card" onClick={() => onSelectOrder(order.orderId)}>
//             <div className="order-header">
//               <span className="order-id">Order #{order.orderId}</span>
//               <span className={`order-status ${order.orderStatus?.toLowerCase()}`}>
//                 {order.orderStatus}
//               </span>
//             </div>
//             <div className="order-body">
//               <p>Date: {new Date(order.orderDate).toLocaleDateString()}</p>
//               <p>Total Amount: ₹{order.totalAmount?.toFixed(2) || '0.00'}</p>
//               <p>Payment Status: {order.paymentStatus}</p>
//             </div>
//             <button className="view-details-btn">View Details</button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default OrderList;

import React, { useState, useEffect } from 'react';
// import './OrderList.css'; // your CSS file
import { getUserOrders } from '../Api';

// Map order status codes to friendly labels (adjust to your backend codes)
const orderStatusMap = {
  1: 'Pending',
  2: 'Processing',
  3: 'Shipped',
  4: 'Delivered',
  5: 'Cancelled',
};

// Map payment status codes to friendly labels
const paymentStatusMap = {
  1: 'Pending',
  2: 'Completed',
  3: 'Failed',
};

const OrderList = ({ onSelectOrder }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    console.log('Token:', localStorage.getItem('token'));
    const fetchOrders = async () => {
      if (!userId) {
        setError('User not logged in');
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const data = await getUserOrders(userId);

        if (Array.isArray(data)) {
          // Sort newest orders first
          const sortedOrders = data.sort(
            (a, b) => new Date(b.orderDate) - new Date(a.orderDate)
          );
          setOrders(sortedOrders);
        } else {
          setError('Invalid data format received from server');
        }
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to load orders. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [userId]);

  if (loading) return <div className="loading">Loading your orders...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (orders.length === 0)
    return (
      <div className="no-orders">
        <h2>No Orders Found</h2>
        <p>You haven't placed any orders yet.</p>
      </div>
    );

  return (
    <div className="orders-container">
      <h2 className="orders-header">My Orders</h2>
      <div className="orders-list">
        {orders.map((order) => {
          // Compute total if API returns zero or missing totalAmount
          const total =
            order.totalAmount && order.totalAmount > 0
              ? order.totalAmount
              : order.orderItems_
              ? order.orderItems_.reduce(
                  (acc, item) =>
                    acc + (item.totalPrice || item.price * item.quantity || 0),
                  0
                )
              : 0;

          return (
            <div
              key={order.orderId}
              className="order-card"
              onClick={() => onSelectOrder(order.orderId)}
              style={{ cursor: 'pointer' }}
            >
              <div className="order-header">
                <span className="order-id">Order #{order.orderId}</span>
                <span
                  className={`order-status status-${(orderStatusMap[order.orderStatus] || 'pending')
                    .toLowerCase()}`}
                >
                  {orderStatusMap[order.orderStatus] || 'Pending'}
                </span>
              </div>
              <div className="order-body">
                <p>
                  Date:{' '}
                  {new Date(order.orderDate).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
                <p>Total Amount: ₹{total.toFixed(2)}</p>
                <p
                  className={`payment-status payment-${
                    (paymentStatusMap[order.paymentStatus] || 'pending').toLowerCase()
                  }`}
                >
                  Payment Status: {paymentStatusMap[order.paymentStatus] || 'Pending'}
                </p>
              </div>
              <button className="view-details-button">View Details</button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderList;