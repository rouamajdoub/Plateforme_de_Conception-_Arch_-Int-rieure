import { useState } from "react";
import { motion } from "framer-motion";

const subscriptionTiers = [
  {
    title: "Free",
    price: 0,
    features: [
      "Access to project posting",
      "Basic architect matching",
      "View architect profiles",
      "Limited messaging with architects",
      "Basic support",
    ],
  },
  {
    title: "Pro",
    price: 120,
    features: [
      "Priority architect matching",
      "Unlimited messaging with architects",
      "Access to architect portfolios & reviews",
      "Project management dashboard",
      "Exclusive architect recommendations",
      "Priority customer support",
    ],
  },
  {
    title: "Business",
    price: 200,
    features: [
      "All Pro features included",
      "Personalized architect selection assistance",
      "Priority access to top-rated architects",
      "Project milestone tracking",
      "Legal and contract assistance",
      "Premium customer support",
    ],
  },
];

const SubscriptionStep = ({ onNext, onSelectSubscription }) => {
  const [selectedSubscription, setSelectedSubscription] = useState(null);

  const handleSelect = (subscription) => {
    setSelectedSubscription(subscription);
    onSelectSubscription(subscription);
  };

  return (
    <div className="subscription-step">
      <h2>Step 3: Choose Subscription</h2>
      <div className="subscription-cards">
        {subscriptionTiers.map((subscription, index) => (
          <motion.div
            key={index}
            className={`subscription-card ${
              selectedSubscription?.title === subscription.title ? "selected" : ""
            }`}
            onClick={() => handleSelect(subscription)}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <h3>{subscription.title}</h3>
            <div className="price">
              {subscription.price === 0 ? (
                "Free"
              ) : (
                <>
                  {subscription.price} TND<span>/Year</span>
                </>
              )}
            </div>
            <ul>
              {subscription.features.map((feature, idx) => (
                <li key={idx}>{feature}</li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
      <button
        className="next-btn"
        onClick={onNext}
        disabled={!selectedSubscription}
      >
        Next
      </button>
    </div>
  );
};

export default SubscriptionStep;