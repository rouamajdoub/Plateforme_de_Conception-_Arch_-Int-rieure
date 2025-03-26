import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login.jsx";
import Signup from "./pages/auth/Signup.jsx";
import Dashboard from "./pages/Dashboard/Admin/AdminDashboard.jsx";
import ArchitectDashboard from "./pages/Dashboard/Architect/Main.jsx";
import Calender from "./pages/Dashboard/Architect/pages/Calendar/Calendar.jsx";
import HomePage from "./pages/client_home_page/Home.jsx";

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/architect" element={<ArchitectDashboard />} />
        <Route path="/admin_dashboard" element={<Dashboard />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/calender" element={<Calender />} />

        <Route path="*" element={<HomePage />} />
      </Routes>
    </>
  );
}

export default App;
