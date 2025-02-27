import React, { useEffect, useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import ReviewManagement from "./ReviewManagement";
import UserManagement from "./UserManagement";
import SubscriptionManagement from "./SubscriptionManagement";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import D3UserStatistics from "../components/D3UserStatistics";
import D3ReviewManagementChart from "../components/D3ReviewManagementChart";
import D3SubscriptionChart from "../components/D3SubscriptionChart";
import "../styles/adminDashboard.css";

const AdminDashboard = () => {
  const [userData, setUserData] = useState([]);
  const [reviewData, setReviewData] = useState([]);
  const [subscriptionData, setSubscriptionData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await fetch("http://localhost:5000/api/users");
        const users = await userRes.json();
        setUserData(users);

        const reviewRes = await fetch("http://localhost:5000/api/projects/reviews");
        const reviews = await reviewRes.json();
        setReviewData(reviews);

        const subscriptionRes = await fetch("http://localhost:5000/api/subscriptions");
        const subscriptions = await subscriptionRes.json();
        setSubscriptionData(subscriptions);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="admin-dashboard-layout">
      <Header />
      <Navbar />
      <div className="admin-dashboard">
        <nav className="navbar">
          <ul>
            <li><Link to="/admin/reviews">Gestion des Avis</Link></li>
            <li><Link to="/admin/users">Gestion des Utilisateurs</Link></li>
            <li><Link to="/admin/subscriptions">Gestion des Abonnements</Link></li>
          </ul>
        </nav>

        <main className="main-content">
          {userData.length > 0 && <D3UserStatistics data={userData} />}
          {reviewData.length > 0 && <D3ReviewManagementChart data={reviewData} />}
          {subscriptionData.length > 0 && <D3SubscriptionChart data={subscriptionData} />}
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
