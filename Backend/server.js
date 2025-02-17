require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const subscriptionRoutes = require("./routes/subscriptionRoutes");
const projectsDatabaseRoutes = require("./routes/projects_dbRoutes");
const marketplaceRoutes = require("./routes/marketplaceRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const authRoutes = require("./routes/authRoutes");
//--------------------------------------------------------------------------------
const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.json());
connectDB();
//--------------------------------------------Routes --------------------
// auth routes
app.use("/api/auth", authRoutes);
// user routes
app.use("/api/users", userRoutes);
app.use("/api/clients", userRoutes);
app.use("/api/architects", userRoutes);
//  subscription routes
app.use("/api/subscriptions", subscriptionRoutes);
//  projects  routes
app.use("/api/projectsDatabase", projectsDatabaseRoutes);

// routes de la marketplace
app.use("/api/marketplace", marketplaceRoutes);
//  routes de paiement
app.use("/api/payments", paymentRoutes);
// routes de la Dashboard
app.use("/api/dashboard", dashboardRoutes);
////////////////////////
//-----------------------------------------------------
app.get("/", (req, res) => {
  res.send("Hello, Roua! Express & MongoDB are working 🚀");
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
