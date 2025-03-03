import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./components/Login.jsx";
import Signup from "./components/Signup.jsx";
import Dashboard from "./pages/AdminDashboard.jsx";
import SubscriptionManagement from "./pages/SubscriptionManagement.jsx";
import ReviewManagement from "./pages/ReviewManagement.jsx";
import UserManagement from "./pages/UserManagement.jsx"; 

function App() {
  return (
    <>
      
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route
          path="/admin/subscriptions"
          element={<SubscriptionManagement />}
        />
        <Route path="/admin/reviews" element={<ReviewManagement />} />
        <Route path="/admin/users" element={<UserManagement />} />{" "}
        <Route path="*" element={<Dashboard />} />
      </Routes>
    </>
  );
}

export default App;
