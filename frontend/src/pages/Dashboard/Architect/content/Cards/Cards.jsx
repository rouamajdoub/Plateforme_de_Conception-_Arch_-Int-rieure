import React, { useState } from "react";
import "./cards.css";
import { CardsData } from "./Data";
import Card from "../Card/Card";

const Cards = () => {
  const [expandedCard, setExpandedCard] = useState(null);

  const handleCardClick = (title) => {
    setExpandedCard((prev) => (prev === title ? null : title));
  };

  return (
    <div className="Cards">
      {CardsData.map((card, id) => (
        <div className="parentContainer" key={id}>
          <Card
            title={card.title}
            color={card.color}
            barValue={card.barValue}
            value={card.value}
            series={card.series}
            isExpanded={expandedCard === card.title}
            onCardClick={() => handleCardClick(card.title)}
          />
        </div>
      ))}
    </div>
  );
};

export default Cards;
