// components/SubscribeButton.jsx
import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const SubscribeButton = ({ userId, subscriptionType = 'premium' }) => {
  const handleSubscribe = async () => {
    try {
      const stripe = await stripePromise;

      const { data } = await axios.post('/api/payments/create-checkout-session', {
        userId,
        subscriptionType, // example: "premium" or "vip"
      });

      await stripe.redirectToCheckout({ sessionId: data.sessionId });
    } catch (err) {
      console.error('Error during checkout:', err);
      alert('Something went wrong. Please try again.');
    }
  };

  return (
    <button className="btn-subscribe" onClick={handleSubscribe}>
      Subscribe Now
    </button>
  );
};

export default SubscribeButton;
