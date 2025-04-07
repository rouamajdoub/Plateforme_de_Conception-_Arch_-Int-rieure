import React from 'react';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchUserProfile } from '../redux/slices/authSlice';

const PaymentSuccess = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Optionally fetch updated profile
    const userId = localStorage.getItem('userId');
    if (userId) dispatch(fetchUserProfile(userId));
  }, [dispatch]);

  return (
    <div className="payment-success">
      <h2>🎉 Payment Successful!</h2>
      <p>Your subscription is now active.</p>
    </div>
  );
};

export default PaymentSuccess;
