import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/client_home_page/page/Home.jsx";
import Login from "./pages/auth/Login.jsx";
import Signup from "./pages/auth/Signup.jsx";
import Dashboard from "./pages/Dashboard/Admin/AdminDashboard.jsx";
import ArchitectDashboard from "./pages/Dashboard/Architect/Main.jsx";
function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/architect" element={<ArchitectDashboard />} />
        <Route path="/admin_dashboard" element={<Dashboard />} />
        <Route path="/home" element={<HomePage />} />

        <Route path="*" element={<Dashboard />} />
      </Routes>
    </>
  );
}

export default App;
