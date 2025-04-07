import React from "react";
import { motion } from "framer-motion";
import "./Pricing.css";
import Header from "./header/Header";
import Diff from "./Diff/Diff";

const pricingTiers = [
  {
    title: "Free",
    monthlyPrice: 0,
    buttonText: "Get started for free",
    popular: false,
    inverse: false,
    features: [
      "Access to project posting",
      "Basic architect matching",
      "View architect profiles",
      "Limited messaging with architects",
      "Basic support",
    ],
  },
  {
    title: "VIP",
    monthlyPrice: 120,
    buttonText: "Upgrade to Pro",
    popular: true,
    inverse: true,
    features: [
      "Priority architect matching",
      "Unlimited messaging with architects",
      "Access to architect portfolios & reviews",
      "Project management dashboard",
      "Exclusive architect recommendations",
      "Priority customer support",
    ],
    link: "https://buy.stripe.com/test_bIYfZCdFj6YSbcs3cc", 
    priceId: "prod_S1L9JODnAOUsla", 
  },
  {
    title: "Premium",
    monthlyPrice: 200,
    buttonText: "Get Business Plan",
    popular: false,
    inverse: false,
    features: [
      "All Pro features included",
      "Personalized architect selection assistance",
      "Priority access to top-rated architects",
      "Project milestone tracking",
      "Legal and contract assistance",
      "Premium customer support",
    ],
    link: "https://buy.stripe.com/test_14k6p244J0Aua8oeUV", 
    priceId: "prod_S45K8IsY2smSX0", 
  },
];

export const Pricing = () => {
  const handlePayment = (link) => {
    if (link) {
      window.open(link, "_blank");
    } else {
      alert("Payment link not available. Please try again later.");
    }
  };

  return (
    <section className="pricing-section">
      <Header />
      <div className="container" style={{ paddingTop: "60px" }}>
        <div className="section-heading">
          <h2 className="section-title">Unlock Your Full Potential</h2>
          <p className="section-description">
            Choose the perfect plan that fits your needs. Start for free and
            upgrade anytime to access advanced features and exclusive benefits.
          </p>
        </div>
        <div className="pricing-tiers">
          {pricingTiers.map(
            (
              {
                title,
                monthlyPrice,
                buttonText,
                popular,
                inverse,
                features,
                link,
              },
              index
            ) => (
              <div
                key={index}
                className={`pricing-card ${inverse ? "inverse" : ""}`}
              >
                <div className="card-header">
                  <h3
                    className={`card-title ${
                      inverse ? "text-white" : "text-black"
                    }`}
                  >
                    {title}
                  </h3>
                  {popular && (
                    <div className="popular-badge">
                      <motion.span
                        animate={{ backgroundPositionX: "100%" }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                          repeatType: "loop",
                        }}
                        className="popular-text"
                      >
                        Popular
                      </motion.span>
                    </div>
                  )}
                </div>
                <div className="price">
                  <span className="monthly-price">{monthlyPrice} TND</span>
                  <span className="price-label">/Year</span>
                </div>
                {monthlyPrice > 0 && (
                  <button
                    className={`pricing-button ${
                      inverse ? "inverse-button" : ""
                    }`}
                    onClick={() => handlePayment(link)}
                  >
                    {buttonText}
                  </button>
                )}
                <ul className="feature-list">
                  {features.map((feature, index) => (
                    <li className="feature-item" key={index}>
                      <span className="checkmark">✔️</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )
          )}
        </div>
        <Diff />
      </div>
    </section>
  );
};
export default Pricing;