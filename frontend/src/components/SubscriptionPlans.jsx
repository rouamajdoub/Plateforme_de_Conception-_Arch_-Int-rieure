import React from "react";
import "../styles/Auth.css"; // Assure-toi que le CSS est bien importé

const SubscriptionPlans = ({ onSelect }) => {
  // Liste des abonnements
  const plans = [
    {
      id: "free",
      name: "Gratuit",
      price: "0€",
      benefits: ["Accès limité aux projets", "Profil public", "Pas de support premium"],
      limit: "1 projet en cours",
    },
    {
      id: "premium",
      name: "Premium",
      price: "19,99€/mois",
      benefits: ["Accès illimité aux projets", "Profil mis en avant", "Support client prioritaire"],
      limit: "Projets illimités",
    },
    {
      id: "vip",
      name: "VIP",
      price: "49,99€/mois",
      benefits: ["Accès exclusif aux clients premium", "Consultation prioritaire", "Gestionnaire de compte dédié"],
      limit: "Accès exclusif",
    },
  ];

  return (
    <div className="subscription-container">
      <h2>Choisissez un abonnement</h2>
      <div className="subscription-cards">
        {plans.map((plan) => (
          <div key={plan.id} className="subscription-card" onClick={() => onSelect(plan.id)}>
            <h3>{plan.name}</h3>
            <p className="price">{plan.price}</p>
            <ul>
              {plan.benefits.map((benefit, index) => (
                <li key={index}>✅ {benefit}</li>
              ))}
            </ul>
            <p className="limit">🔒 {plan.limit}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubscriptionPlans;
