// AdminDashboard.js
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Grid, Paper } from "@mui/material";
import { fetchUsers, fetchReviews, fetchSubscriptions } from "../../../redux/slices/adminSlice";

// Import global components
import Topbar from "./global_admin/Topbar";
import Sidebar from "./global_admin/Sidebar";
import Header from "../../../components/Header";

// Import charts
import UserStatisticsChart from "../../../components/charts/Bar/UserStat";
import ReviewManagementChart from "../../../components/charts/Bar/ReviewChart";
import SubscriptionChart from "../../../components/charts/Pie/SubscriptionChart";

// Import management pages
import ReviewManagement from "./ReviewManagement";
import UserManagement from "./UserManagement";
import SubscriptionManagement from "./SubscriptionManagement";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { users, reviews, subscriptions } = useSelector((state) => state.admin);
  
  const [currentView, setCurrentView] = useState("dashboard"); // Default view

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchReviews());
    dispatch(fetchSubscriptions());
  }, [dispatch]);

  // Calculate counts per subscription plan
  const counts = subscriptions.reduce((acc, sub) => {
    const plan = sub.plan.toLowerCase();
    if (plan === "free" || plan === "vip" || plan === "premium") {
      acc[plan] = (acc[plan] || 0) + 1;
    }
    return acc;
  }, {});

  const chartData = ["free", "vip", "premium"].map((plan) => ({
    id: plan,
    label: plan.charAt(0).toUpperCase() + plan.slice(1),
    value: counts[plan] || 0,
  }));

  return (
    <Box sx={{ display: "flex", height: "100vh", backgroundColor: "#2D3748" }}>
      <Sidebar setCurrentView={setCurrentView} />

      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <Topbar />

        <Box sx={{ p: 3 }}>
          <Header title="Admin Dashboard" subtitle="Overview of the platform" />

          {/* Conditional rendering based on currentView */}
          {currentView === "dashboard" && (
            <Grid container spacing={3} sx={{ mt: 2 }}>
              <Grid item xs={12} md={4}>
                <Paper elevation={3} sx={{ p: 2 }}>
                  <UserStatisticsChart data={users} />
                </Paper>
              </Grid>
              <Grid item xs={12} md={4}>
                <Paper elevation={3} sx={{ p: 2 }}>
                  <ReviewManagementChart data={reviews} />
                </Paper>
              </Grid>
              <Grid item xs={12} md={4}>
                <Paper elevation={3} sx={{ p: 2 }}>
                  <SubscriptionChart data={chartData} />
                </Paper>
              </Grid>
            </Grid>
          )}

          {currentView === "reviews" && <ReviewManagement />}
          {currentView === "users" && <UserManagement />}
          {currentView === "subscriptions" && <SubscriptionManagement />}
        </Box>
      </Box>
    </Box>
  );
};

export default AdminDashboard;