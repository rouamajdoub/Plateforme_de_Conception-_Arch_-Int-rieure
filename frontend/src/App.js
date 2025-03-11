import React from "react";
import { Routes, Route } from "react-router-dom";

import Login from "./pages/auth/Login.jsx";
import Signup from "./pages/auth/Signup.jsx";
import Dashboard from "./pages/Dashboard/Admin/AdminDashboard.jsx";
import SubscriptionManagement from "./pages/Dashboard/Admin/SubscriptionManagement.jsx";
import ReviewManagement from "./pages/Dashboard/Admin/ReviewManagement.jsx";
import UserManagement from "./pages/Dashboard/Admin/UserManagement.jsx";
import ArchitectDashboard from "./pages/Dashboard/Architect/main.jsx";
function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/Arch_Dashboard" element={<ArchitectDashboard />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route
          path="/admin/subscriptions"
          element={<SubscriptionManagement />}
        />
        <Route path="/admin/reviews" element={<ReviewManagement />} />
        <Route path="/admin/users" element={<UserManagement />} />{" "}
        <Route path="*" element={<ArchitectDashboard />} />
      </Routes>
    </>
  );
}

export default App;
