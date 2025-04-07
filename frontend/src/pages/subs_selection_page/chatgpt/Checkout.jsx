// components/Checkout.js
import React from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

const Checkout = () => {
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);

  const handleSubscribe = async () => {
    try {
      const response = await axios.post(
        '/api/payments/create-checkout-session',
        {
          userId: user._id,
          email: user.email,
          role: user.role,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Redirect to Stripe Checkout
      window.location.href = response.data.url;
    } catch (error) {
      console.error('Checkout error:', error.response?.data || error.message);
      alert('Checkout failed. Please try again.');
    }
  };

  return (
    <div>
      <h2>Upgrade Your Subscription</h2>
      <p>You are currently on: <strong>{user.subscription || 'Free Plan'}</strong></p>
      <button onClick={handleSubscribe}>Subscribe to Premium</button>
    </div>
  );
};

export default Checkout;
