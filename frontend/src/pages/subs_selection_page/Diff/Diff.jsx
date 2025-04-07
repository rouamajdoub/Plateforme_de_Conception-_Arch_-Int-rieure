import React from "react";
import "./Diff.css"; // Import the CSS file

const Diff = () => {
  const plans = [
    {
      name: "Free Plan (Basic Access)",
      price: "$0/month",
      audience: "Clients & Architects (Limited Features)",
      features: [
        "✅ Browse available architects and projects",
        "✅ Post project requests (limited to 1 per month)",
        "❌ No priority support",
        "❌ Limited visibility in search results (for architects)",
      ],
    },
    {
      name: "Premium Plan",
      price: "$X/month",
      audience: "Professional architects looking to expand their reach",
      features: [
        "✅ Unlimited project proposals & bids",
        "✅ Higher visibility in search results",
        "✅ Access to premium analytics (track profile views, project engagement, etc.)",
        "✅ Ability to showcase a portfolio with up to 10 projects",
        "✅ Priority customer support",
      ],
    },
    {
      name: "Enterprise Plan",
      price: "Custom Pricing",
      audience:
        "Architecture firms or teams that need advanced collaboration tools",
      features: [
        "✅ All Premium Plan features",
        "✅ Dedicated account manager",
        "✅ Team collaboration tools",
        "✅ API access for integrating with internal systems",
        "✅ Featured spot in the Visiona marketplace",
      ],
    },
  ];

  return (
    <div className="diff-table">
      <h2 className="table-title">Subscription Plans Comparison</h2>
      <table>
        <thead>
          <tr>
            <th>Plan</th>
            <th>Price</th>
            <th>For</th>
            <th>Features</th>
          </tr>
        </thead>
        <tbody>
          {plans.map((plan, index) => (
            <tr key={index}>
              <td>{plan.name}</td>
              <td>{plan.price}</td>
              <td>{plan.audience}</td>
              <td>
                <ul>
                  {plan.features.map((feature, idx) => (
                    <li key={idx}>{feature}</li>
                  ))}
                  <li className="best-for">{plan.bestFor}</li>
                </ul>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Diff;
