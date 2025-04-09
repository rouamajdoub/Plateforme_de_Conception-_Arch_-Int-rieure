import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login.jsx";
import Signup from "./pages/auth/Signup.jsx";
import Dashboard from "./pages/Dashboard/Admin/AdminDashboard.jsx";
import ArchitectDashboard from "./pages/Dashboard/Architect/Main.jsx";
import Calender from "./pages/Dashboard/Architect/pages/Calendar/Calendar.jsx";
import Home from "./pages/client_page/projects_showcase/Home.jsx";
import Main from "./pages/client_page/Home-Client/Main.jsx";
import { Pricing } from "./pages/subs_selection_page/Pricing.jsx";
//import PaymentSuccess from "./pages/subs_selection_page/PaymentSuccess.jsx";
function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/architect" element={<ArchitectDashboard />} />
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/project_showcase" element={<Home />} />
        <Route path="/calender" element={<Calender />} />
        <Route path="/home" element={<Main />} />
        <Route path="/subs" element={<Pricing />} />

        <Route path="*" element={<Home />} />
      </Routes>
    </>
  );
}

export default App;
