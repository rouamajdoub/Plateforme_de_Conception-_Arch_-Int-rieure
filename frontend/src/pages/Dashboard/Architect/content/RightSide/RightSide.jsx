import React from "react";
import "./RightSide.css";
import CalenderS from "../CalenderS/CalenderS";
import CustomerReview from "../CustomerReview/CustomerReview";
const RightSide = () => {
  return (
    <div className="RightSide">
      <div>
        <CalenderS />
      </div>
      <div>
        <CustomerReview />
      </div>
    </div>
  );
};

export default RightSide;
