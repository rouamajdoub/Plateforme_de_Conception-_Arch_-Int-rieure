// pages/SubscribePage.jsx
import React from "react";
import { useSelector } from "react-redux";
import SubscribeButton from "../SubscribeButton";

const SubscribePage = () => {
  const user = useSelector((state) => state.auth.user);

  return (
    <div>
      <h2>Upgrade Your Plan</h2>
      <p>Get access to exclusive features</p>
      {user && <SubscribeButton userId={user._id} subscriptionType="premium" />}
    </div>
  );
};

export default SubscribePage;
