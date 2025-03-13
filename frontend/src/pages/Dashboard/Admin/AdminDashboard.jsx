import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Box, Grid, Paper, CircularProgress, Typography } from "@mui/material";

// Global components
import Topbar from "./global_admin/Topbar";
import Sidebar from "./global_admin/Sidebar";
import Header from "../../../components/Header";

// Charts (replace with your actual chart components)
import UserStatisticsChart from "../../../components/charts/Bar/UserStat";
import ReviewManagementChart from "../../../components/charts/Bar/ReviewChart";
import UserStatsChart from "../../../components/charts/line/UserStatsChart";

// Management pages (for example purposes)
import ReviewManagement from "./ReviewManagement";
import UserManagement from "./UserManagement";
import SubscriptionManagement from "./SubscriptionManagement";
import ArchiSignUpReq from "./ArchiSignUpReq";
//-----------css--
import "./css/style.css";

// Redux actions from adminSlice
import {
  fetchUsers,
  fetchAllReviews,
  fetchSubscriptions,
  fetchUserStats,
} from "../../../redux/slices/adminSlice";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { users, reviews, userStats, loading, error } = useSelector(
    (state) => state.admin
  );
  const [currentView, setCurrentView] = useState("dashboard");

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchAllReviews());
    dispatch(fetchSubscriptions());
    dispatch(fetchUserStats()); // Fetch user stats here
  }, [dispatch]);

  const Header = ({ title }) => (
    <Typography variant="h1" className="section-title">
      {title}
    </Typography>
  );
  const renderDashboard = () => (
    <Grid container spacing={3} sx={{ mt: 2 }}>
      <Grid item xs={12} md={4}>
        <Paper elevation={3} sx={{ p: 2, backgroundColor: "transparent" }}>
          <UserStatisticsChart data={users} />
        </Paper>
      </Grid>
      <Grid item xs={12} md={4}>
        <Paper elevation={3} sx={{ p: 2, backgroundColor: "transparent" }}>
          <ReviewManagementChart
            productReviews={reviews?.productReviews || []}
          />
        </Paper>
      </Grid>
      <Grid item xs={12} md={4}>
        <Paper elevation={3} sx={{ p: 2, backgroundColor: "transparent" }}>
          <UserStatsChart data={userStats} />
        </Paper>
      </Grid>
    </Grid>
  );

  return (
    <Box className="custom-background" sx={{ display: "flex" }}>
      <Sidebar setCurrentView={setCurrentView} />
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <Topbar />
        <Box sx={{ p: 3 }}>
          <Header title="Admin Dashboard" />
          {loading && <CircularProgress />}
          {error && <Typography color="error">{error}</Typography>}
          {currentView === "dashboard" && renderDashboard()}
          {currentView === "reviews" && <ReviewManagement />}
          {currentView === "users" && <UserManagement />}
          {currentView === "subscriptions" && <SubscriptionManagement />}
          {currentView === "sign-up-req" && <ArchiSignUpReq />}
        </Box>
      </Box>
    </Box>
  );
};

export default AdminDashboard;
