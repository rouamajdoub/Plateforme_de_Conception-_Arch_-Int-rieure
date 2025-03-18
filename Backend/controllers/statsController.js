const Project = require("../models/Project");
const Order = require("../models/Order");
const User = require("../models/User");
const mongoose = require("mongoose");

// Statistics controller to fetch dashboard data
exports.getDashboardStats = async (req, res) => {
  try {
    const userId = req.params.userId; // Assuming the user ID is passed as a parameter

    // 1. Revenue from Sales - For marketplace transactions
    const revenueStats = await getRevenueStats(userId);

    // 2. Profile Views - Number of times the profile was visited
    const profileViewsStats = await getProfileViewsStats(userId);

    // 3. Ongoing Projects - Active projects in progress
    const ongoingProjectsStats = await getOngoingProjectsStats(userId);

    res.status(200).json({
      success: true,
      data: {
        revenue: revenueStats,
        profileViews: profileViewsStats,
        ongoingProjects: ongoingProjectsStats,
      },
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Get revenue statistics from completed orders
async function getRevenueStats(userId) {
  // Get the last 6 months of data
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  // For architects, we need to find products where they are the seller
  const orders = await Order.aggregate([
    // Find all orders containing products sold by this user
    { $unwind: "$products" },
    {
      $lookup: {
        from: "products",
        localField: "products.product",
        foreignField: "_id",
        as: "productDetails",
      },
    },
    { $unwind: "$productDetails" },
    // Filter for products where the seller is the current user
    {
      $match: {
        "productDetails.seller": mongoose.Types.ObjectId(userId),
        createdAt: { $gte: sixMonthsAgo },
      },
    },
    // Group by month and calculate revenue
    {
      $group: {
        _id: {
          month: { $month: "$createdAt" },
          year: { $year: "$createdAt" },
        },
        revenue: {
          $sum: {
            $multiply: ["$products.quantity", "$productDetails.price"],
          },
        },
        count: { $sum: 1 },
      },
    },
    // Sort by year and month
    { $sort: { "_id.year": 1, "_id.month": 1 } },
  ]);

  // Transform into the format needed for the frontend
  const monthlyData = formatMonthlyData(orders, "revenue");

  // Calculate total revenue
  const totalRevenue = orders.reduce((total, item) => total + item.revenue, 0);

  return {
    total: totalRevenue,
    monthly: monthlyData,
  };
}

// Get profile views statistics
async function getProfileViewsStats(userId) {
  // Note: You'll need to add a field to track profile views in your User/Architect model
  // This is a placeholder assuming you've implemented that feature

  // Get the architect's profile
  const user = await User.findById(userId);

  // If profile views tracking hasn't been implemented yet, you need to add:
  // 1. A profileViews field to your architect schema
  // 2. A timestamp array for when views occurred
  // 3. An API endpoint to increment views when a profile is visited

  // For now, we'll return placeholder data
  // In a real implementation, you would aggregate views by month

  // Assuming you've added a profileViews field to your schema
  const totalViews = user.profileViews || 0;

  // Placeholder monthly data
  // In reality, you'd query a collection that tracks profile view events with timestamps
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  // This would be an actual query in a real implementation
  const monthlyViews = [];

  // Return formatted data
  return {
    total: totalViews,
    monthly: generatePlaceholderMonthlyData(),
  };
}

// Get ongoing projects statistics
async function getOngoingProjectsStats(userId) {
  // Get the last 6 months of data
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  // Count ongoing projects by month for this architect
  const projects = await Project.aggregate([
    // Match projects assigned to this architect that are in progress
    {
      $match: {
        architectId: mongoose.Types.ObjectId(userId),
        status: "in_progress",
        createdAt: { $gte: sixMonthsAgo },
      },
    },
    // Group by month
    {
      $group: {
        _id: {
          month: { $month: "$createdAt" },
          year: { $year: "$createdAt" },
        },
        count: { $sum: 1 },
      },
    },
    // Sort by year and month
    { $sort: { "_id.year": 1, "_id.month": 1 } },
  ]);

  // Transform into the format needed for the frontend
  const monthlyData = formatMonthlyData(projects, "count");

  // Get current ongoing projects count
  const currentOngoingProjects = await Project.countDocuments({
    architectId: userId,
    status: "in_progress",
  });

  return {
    total: currentOngoingProjects,
    monthly: monthlyData,
  };
}

// Helper function to format monthly data for charts
function formatMonthlyData(data, valueField) {
  const months = [];
  const values = [];

  // Get current date for reference
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Create arrays for the last 6 months
  for (let i = 5; i >= 0; i--) {
    const targetMonth = new Date(currentDate);
    targetMonth.setMonth(currentMonth - i);

    const monthName = targetMonth.toLocaleString("default", { month: "short" });
    months.push(monthName);

    // Find if we have data for this month
    const monthData = data.find(
      (item) =>
        item._id.month === targetMonth.getMonth() + 1 &&
        item._id.year === targetMonth.getFullYear()
    );

    values.push(monthData ? monthData[valueField] : 0);
  }

  return { months, values };
}

// Helper function to generate placeholder monthly data
function generatePlaceholderMonthlyData() {
  const months = [];
  const values = [];

  // Get current date for reference
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();

  // Create arrays for the last 6 months with random data
  for (let i = 5; i >= 0; i--) {
    const targetMonth = new Date(currentDate);
    targetMonth.setMonth(currentMonth - i);

    const monthName = targetMonth.toLocaleString("default", { month: "short" });
    months.push(monthName);

    // Generate a random number between 10 and 100 for placeholder data
    values.push(Math.floor(Math.random() * 90) + 10);
  }

  return { months, values };
}

// Since you need to track profile views, we need an endpoint to increment them
exports.incrementProfileViews = async (req, res) => {
  try {
    const profileId = req.params.profileId;

    // Update the profile views count
    // This needs to be implemented in your User/Architect model
    await User.findByIdAndUpdate(profileId, {
      $inc: { profileViews: 1 },
      // You might also want to push a timestamp to an array to track when views happened
      $push: { profileViewsTimestamps: new Date() },
    });

    res.status(200).json({
      success: true,
      message: "Profile view recorded",
    });
  } catch (error) {
    console.error("Error recording profile view:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Get all statistics data for comparison chart
exports.getComparisonStats = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Get the current month
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    // Get the previous month
    const previousMonth = new Date(currentDate);
    previousMonth.setMonth(currentMonth - 1);
    const prevMonth = previousMonth.getMonth();
    const prevYear = previousMonth.getFullYear();

    // Get revenue for current and previous month
    const currentMonthRevenue = await calculateMonthlyRevenue(
      userId,
      currentMonth,
      currentYear
    );
    const previousMonthRevenue = await calculateMonthlyRevenue(
      userId,
      prevMonth,
      prevYear
    );

    // Get profile views for current and previous month
    const currentMonthViews = await calculateMonthlyProfileViews(
      userId,
      currentMonth,
      currentYear
    );
    const previousMonthViews = await calculateMonthlyProfileViews(
      userId,
      prevMonth,
      prevYear
    );

    // Get ongoing projects count for current and previous month
    const currentMonthProjects = await calculateMonthlyOngoingProjects(
      userId,
      currentMonth,
      currentYear
    );
    const previousMonthProjects = await calculateMonthlyOngoingProjects(
      userId,
      prevMonth,
      prevYear
    );

    res.status(200).json({
      success: true,
      data: {
        revenue: {
          current: currentMonthRevenue,
          previous: previousMonthRevenue,
          change: calculatePercentageChange(
            previousMonthRevenue,
            currentMonthRevenue
          ),
        },
        profileViews: {
          current: currentMonthViews,
          previous: previousMonthViews,
          change: calculatePercentageChange(
            previousMonthViews,
            currentMonthViews
          ),
        },
        ongoingProjects: {
          current: currentMonthProjects,
          previous: previousMonthProjects,
          change: calculatePercentageChange(
            previousMonthProjects,
            currentMonthProjects
          ),
        },
      },
    });
  } catch (error) {
    console.error("Error fetching comparison stats:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Calculate monthly revenue
async function calculateMonthlyRevenue(userId, month, year) {
  // Find all orders containing products sold by this user in the specific month
  const orders = await Order.aggregate([
    // Unwind products array to process each product separately
    { $unwind: "$products" },
    {
      $lookup: {
        from: "products",
        localField: "products.product",
        foreignField: "_id",
        as: "productDetails",
      },
    },
    { $unwind: "$productDetails" },
    // Filter for products where the seller is the current user and the order is from the specific month
    {
      $match: {
        "productDetails.seller": mongoose.Types.ObjectId(userId),
        $expr: {
          $and: [
            { $eq: [{ $month: "$createdAt" }, month + 1] }, // MongoDB months are 1-12
            { $eq: [{ $year: "$createdAt" }, year] },
          ],
        },
      },
    },
    // Calculate total revenue
    {
      $group: {
        _id: null,
        revenue: {
          $sum: {
            $multiply: ["$products.quantity", "$productDetails.price"],
          },
        },
      },
    },
  ]);

  return orders.length > 0 ? orders[0].revenue : 0;
}

// Calculate monthly profile views
async function calculateMonthlyProfileViews(userId, month, year) {
  // This is a placeholder that would use your profile views tracking system
  // For now, returning a random number as placeholder
  return Math.floor(Math.random() * 90) + 10;
}

// Calculate monthly ongoing projects
async function calculateMonthlyOngoingProjects(userId, month, year) {
  // Count projects that were in progress during the specified month
  const projectCount = await Project.countDocuments({
    architectId: mongoose.Types.ObjectId(userId),
    status: "in_progress",
    $expr: {
      $and: [
        { $eq: [{ $month: "$createdAt" }, month + 1] }, // MongoDB months are 1-12
        { $eq: [{ $year: "$createdAt" }, year] },
      ],
    },
  });

  return projectCount;
}

// Helper function to calculate percentage change
function calculatePercentageChange(previous, current) {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

