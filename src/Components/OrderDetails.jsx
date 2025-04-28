// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { getOrderDetails } from '../Api';
// import './CSS/OrderDetails.css';

// const OrderDetails = () => {
//   const { orderId } = useParams();
//   const navigate = useNavigate();
//   const [orderDetails, setOrderDetails] = useState(null);
//   const [productImages, setProductImages] = useState({});
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     if (orderId) {
//       fetchOrderDetails();
//     } else {
//       setError("No order ID provided");
//       setIsLoading(false);
//     }
//   }, [orderId]);

//   const fetchOrderDetails = async () => {
//     try {
//       const data = await getOrderDetails(orderId);
//       console.log('Order details:', data);
//       setOrderDetails(data);
      
//       // Check if orderItems_ exists before trying to loop through it
//       if (data.orderItems_ && Array.isArray(data.orderItems_)) {
//         // Here you could fetch product images if needed
//       }
      
//       setIsLoading(false);
//     } catch (error) {
//       console.error('Error fetching order details:', error);
//       setError("Failed to load order details. Please try again.");
//       setIsLoading(false);
//     }
//   };

//   const getPaymentStatusLabel = (code) => {
//     const statuses = {
//       1: 'Pending',
//       2: 'Completed',
//       3: 'Failed'
//     };
//     return statuses[code] || 'Unknown';
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

//   if (isLoading) {
//     return <div className="loading">Loading order details...</div>;
//   }

//   if (error) {
//     return (
//       <div className="error-container">
//         <div className="error-message">{error}</div>
//         <button className="back-button" onClick={() => navigate('/orders')}>
//           Back to Orders
//         </button>
//       </div>
//     );
//   }

//   if (!orderDetails) {
//     return (
//       <div className="error-container">
//         <div className="error-message">No order details found</div>
//         <button className="back-button" onClick={() => navigate('/orders')}>
//           Back to Orders
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="order-details-container">
//       <h1 className="order-details-header">Order Details</h1>
      
//       <div className="order-info">
//         <div className="order-info-section">
//           <h2>Order Information</h2>
//           <p><span>Order ID:</span> {orderDetails.orderId}</p>
//           <p><span>Order Date:</span> {new Date(orderDetails.orderDate).toLocaleString()}</p>
//           <p><span>Order Status:</span> {getOrderStatusLabel(orderDetails.orderStatus)}</p>
//           <p><span>Payment Status:</span> {getPaymentStatusLabel(orderDetails.paymentStatus)}</p>
//         </div>
        
//         <div className="order-info-section">
//           <h2>Shipping Information</h2>
//           <p><span>Shipping Address:</span></p>
//           <p className="shipping-address-text">{orderDetails.shippingAddress}</p>
//         </div>
//       </div>
      
//       <div className="order-items-section">
//         <h2>Order Items</h2>
//         {orderDetails.orderItems_ && orderDetails.orderItems_.length > 0 ? (
//           <div className="order-items-list">
//             {orderDetails.orderItems_.map(item => (
//               <div key={item.orderItemId} className="order-item">
//                 <div className="order-item-image">
//                   {productImages[item.productId] ? (
//                     <img
//                       src={productImages[item.productId]}
//                       alt={`Product ${item.productId}`}
//                       className="product-image"
//                     />
//                   ) : (
//                     <div className="image-placeholder">No image</div>
//                   )}
//                 </div>
//                 <div className="order-item-details">
//                   <p><span>Product ID:</span> {item.productId}</p>
//                   <p><span>Quantity:</span> {item.quantity}</p>
//                   <p><span>Price:</span> ₹{item.totalPrice?.toFixed(2) || '0.00'}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <p className="no-items">No items in this order</p>
//         )}
//       </div>
      
//       <div className="order-summary">
//         <h2>Order Summary</h2>
//         <p><span>Subtotal:</span> ₹{orderDetails.totalBaseAmount?.toFixed(2) || '0.00'}</p>
//         <p><span>Shipping Cost:</span> ₹{orderDetails.shippingCost?.toFixed(2) || '0.00'}</p>
//         <p className="total-amount"><span>Total Amount:</span> ₹{orderDetails.totalAmount?.toFixed(2) || '0.00'}</p>
//       </div>
      
//       <div className="actions">
//         <button className="back-to-orders" onClick={() => navigate('/orders')}>
//           Back to Orders
//         </button>
//         <button className="back-to-shopping" onClick={() => navigate('/home')}>
//           Continue Shopping
//         </button>
//       </div>
//     </div>
//   );
// };

// export default OrderDetails;

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOrderDetails } from '../Api';
import './CSS/OrderDetails.css';

const orderStatusMap = {
  1: 'Pending',
  2: 'Processing',
  3: 'Shipped',
  4: 'Delivered',
  5: 'Cancelled',
};

const paymentStatusMap = {
  1: 'Pending',
  2: 'Completed',
  3: 'Failed',
};

const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!orderId) {
      setError('No order ID provided');
      setIsLoading(false);
      return;
    }
    const fetchOrderDetails = async () => {
      try {
        setIsLoading(true);
        const data = await getOrderDetails(orderId);
        setOrderDetails(data);
      } catch (err) {
        console.error('Error fetching order details:', err);
        setError('Failed to load order details. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrderDetails();
  }, [orderId]);

  if (isLoading) return <div className="loading">Loading order details...</div>;
  if (error)
    return (
      <div className="error-container">
        <div className="error-message">{error}</div>
        <button className="back-button" onClick={() => navigate('/orders')}>
          Back to Orders
        </button>
      </div>
    );
  if (!orderDetails) return null;

  // Compute total amount fallback if zero or missing
  const totalAmount =
    orderDetails.totalAmount && orderDetails.totalAmount > 0
      ? orderDetails.totalAmount
      : (orderDetails.orderItems_
          ?.reduce(
            (acc, item) => acc + (item.totalPrice || item.price * item.quantity),
            0
          ) || 0) + (orderDetails.shippingCost || 0);

  return (
    <div className="order-details-container">
      <h1 className="order-details-header">Order Details</h1>

      <div className="order-info">
        <div className="order-info-section">
          <h2>Order Information</h2>
          <p>
            <span>Order ID:</span> {orderDetails.orderId}
          </p>
          <p>
            <span>Order Date:</span>{' '}
            {new Date(orderDetails.orderDate).toLocaleString()}
          </p>
          <p>
            <span>Order Status:</span>{' '}
            {orderStatusMap[orderDetails.orderStatus] || 'Unknown'}
          </p>
          <p>
            <span>Payment Status:</span>{' '}
            {paymentStatusMap[orderDetails.paymentStatus] || 'Unknown'}
          </p>
        </div>

        <div className="order-info-section">
          <h2>Shipping Information</h2>
          <p>
            <span>Shipping Address:</span>
          </p>
          <p className="shipping-address-text">
            {orderDetails.shippingAddress || 'No address provided'}
          </p>
        </div>
      </div>

      <div className="order-items-section">
        <h2>Order Items</h2>
        {orderDetails.orderItems_ && orderDetails.orderItems_.length > 0 ? (
          <div className="order-items-list">
            {orderDetails.orderItems_.map((item) => (
              <div key={item.orderItemId} className="order-item">
                <div className="order-item-image">
                  {item.productImageUrl ? (
                    <img
                      src={item.productImageUrl}
                      alt={`Product ${item.productName || item.productId}`}
                      className="product-image"
                    />
                  ) : (
                    <div className="image-placeholder">No image</div>
                  )}
                </div>
                <div className="order-item-details">
                  <p>
                    <span>Product:</span> {item.productName || `Product ID: ${item.productId}`}
                  </p>
                  <p>
                    <span>Quantity:</span> {item.quantity}
                  </p>
                  <p>
                    <span>Price:</span> ₹{(item.totalPrice || (item.price * item.quantity))?.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-items">No items in this order</p>
        )}
      </div>

      <div className="order-summary">
        <h2>Order Summary</h2>
        <p>
          <span>Subtotal:</span> ₹{orderDetails.totalBaseAmount?.toFixed(2) || '0.00'}
        </p>
        <p>
          <span>Shipping Cost:</span> ₹{orderDetails.shippingCost?.toFixed(2) || '0.00'}
        </p>
        <p className="total-amount">
          <span>Total Amount:</span> ₹{totalAmount.toFixed(2)}
        </p>
      </div>

      <div className="actions">
        <button className="back-to-orders" onClick={() => navigate('/orders')}>
          Back to Orders
        </button>
        <button className="back-to-shopping" onClick={() => navigate('/home')}>
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default OrderDetails;