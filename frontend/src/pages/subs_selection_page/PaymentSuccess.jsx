import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';

const PaymentSuccess = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const sessionId = new URLSearchParams(location.search).get('session_id');

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        await axios.get(`/api/payments/verify-session?session_id=${sessionId}`);
        // Dispatch action to update user state if needed
      } catch (error) {
        console.error('Payment verification failed:', error);
      }
    };

    if (sessionId) {
      verifyPayment();
    }
  }, [sessionId]);

  return (
    <div className="payment-success">
      <h2>Payment Successful! 🎉</h2>
      <p>Your subscription has been activated. You now have full access to premium features.</p>
    </div>
  );
};

export default PaymentSuccess;