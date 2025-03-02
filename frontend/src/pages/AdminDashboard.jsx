import React, { useEffect, useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import ReviewManagement from "./ReviewManagement";
import UserManagement from "./UserManagement";
import SubscriptionManagement from "./SubscriptionManagement";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import UserStatisticsChart from "../components/charts/Bar/UserStat";
import ReviewManagementChart from "../components/charts/Bar/ReviewChart";
import SubscriptionChart from "../components/charts/Pie/SubscriptionChart";
import "../styles/adminDashboard.css";

const AdminDashboard = () => {
  const [userData, setUserData] = useState([]);
  const [reviewData, setReviewData] = useState([]);
  const [subscriptionData, setSubscriptionData] = useState([]);
  const [architectLocations, setArchitectLocations] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 🟢 Récupérer tous les utilisateurs
        const userRes = await fetch("http://localhost:5000/api/users");
        if (!userRes.ok) throw new Error("Failed to fetch users");
        const users = await userRes.json();
        console.log("User Data:", users); // Debugging
        setUserData(users);

        // ⭐ Récupérer les avis
        const reviewRes = await fetch("http://localhost:5000/api/projects/reviews");
        if (!reviewRes.ok) throw new Error("Failed to fetch reviews");
        const reviews = await reviewRes.json();
        console.log("Review Data:", reviews); // Debugging
        setReviewData(reviews);

        // 📜 Récupérer les abonnements
        const subscriptionRes = await fetch("http://localhost:5000/api/subscriptions");
        if (!subscriptionRes.ok) throw new Error("Failed to fetch subscriptions");
        const subscriptions = await subscriptionRes.json();
        console.log("Subscription Data:", subscriptions); // Debugging
        setSubscriptionData(subscriptions);

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []); // Ensure the dependency array is set

  return (
    <div className="admin-dashboard-layout">
      <Header />
      <Navbar />

      <div className="admin-dashboard">
        <nav className="navbar">
          <ul>
            <li>
              <Link to="/admin/reviews">📝 Gestion des Avis</Link>
            </li>
            <li>
              <Link to="/admin/users">👥 Gestion des Utilisateurs</Link>
            </li>
            <li>
              <Link to="/admin/subscriptions">📜 Gestion des Abonnements</Link>
            </li>
          </ul>
        </nav>

        <main className="main-content">
          {/* 📊 Statistiques Utilisateurs */}
          <UserStatisticsChart data={userData} />

          {/* ⭐ Avis Clients */}
          <ReviewManagementChart data={reviewData} />

          {/* 🎟️ Gestion des Abonnements */}
          <SubscriptionChart data={subscriptionData} />

          {/* 📌 Routes */}
          <Routes>
            <Route path="/admin/reviews" element={<ReviewManagement />} />
            <Route path="/admin/users" element={<UserManagement />} />
            <Route path="/admin/subscriptions" element={<SubscriptionManagement />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;