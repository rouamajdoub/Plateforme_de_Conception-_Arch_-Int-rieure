import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUsers,
  fetchReviews,
  fetchSubscriptions,
} from "../redux/slices/adminSlice";
import { Box, Grid, Paper } from "@mui/material";

//--------------------import global -----------------------------
import Topbar from "../global_admin/Topbar";
import Sidebar from "../global_admin/Sidebar";
import Header from "../components/Header";
//--------------------import charts -----------------------
import UserStatisticsChart from "../components/charts/Bar/UserStat";
import ReviewManagementChart from "../components/charts/Bar/ReviewChart";
import SubscriptionChart from "../components/charts/Pie/SubscriptionChart";

//--------------------import pages -----------------------
import ReviewManagement from "./ReviewManagement";
import UserManagement from "./UserManagement";
import SubscriptionManagement from "./SubscriptionManagement";
//--------------------import styles -----------------------
import "../styles/admindash.css";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { users, reviews, subscriptions, loading } = useSelector(
    (state) => state.admin
  );

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchReviews());
    dispatch(fetchSubscriptions());
  }, [dispatch]);

  // Calculate counts per subscription plan
  const counts = subscriptions.reduce((acc, sub) => {
    const plan = sub.plan.toLowerCase(); // Ensure the plan is in lowercase
    if (plan === "free" || plan === "vip" || plan === "premium") {
      acc[plan] = (acc[plan] || 0) + 1;
    }
    return acc;
  }, {});

  // Ensure we have values for all types
  const chartData = ["free", "vip", "premium"].map(plan => ({
    id: plan,
    label: plan.charAt(0).toUpperCase() + plan.slice(1), // Capitalize for display
    value: counts[plan] || 0, // Default to 0 if undefined
  }));

  console.log("Chart Data:", chartData); // Debugging

  return (
    <Box sx={{ display: "flex", height: "100vh", backgroundColor: "#cfc7ba" }}>
      {/* Sidebar */}
      <Sidebar />

      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        {/* Topbar */}
        <Topbar />

        {/* Main Content */}
        <Box sx={{ p: 3 }}>
          <Header title="Admin Dashboard" subtitle="Overview of the platform" />

          {/* Stats Section */}
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
                <SubscriptionChart data={chartData} /> {/* Updated chart data */}
              </Paper>
            </Grid>
          </Grid>

          {/* Routes for Management Pages */}
          <Routes>
            <Route path="/admin/reviews" element={<ReviewManagement />} />
            <Route path="/admin/users" element={<UserManagement />} />
            <Route
              path="/admin/subscriptions"
              element={<SubscriptionManagement />}
            />
          </Routes>
        </Box>
      </Box>
    </Box>
  );
};

export default AdminDashboard;