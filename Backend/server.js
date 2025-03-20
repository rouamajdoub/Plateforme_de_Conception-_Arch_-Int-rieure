require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const subscriptionRoutes = require("./routes/subscriptionRoutes");
const projects = require("./routes/projects_dbRoutes");
const marketplaceRoutes = require("./routes/marketplaceRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const reviewRoutes = require("./routes/reviews");
const architectRoutes = require("./routes/architectRoutes"); // Adjust path as necessary
const statsRoutes = require("./routes/statsRoutes");
const quoteRoutes = require("./routes/QuoteRoutes"); // Adjust the path as needed
const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");
//--------------------------------------------------------------------------------
const app = express();
const PORT = process.env.PORT || 5000;
// -------------Enable CORS for all routes -----------------Fontens conx-----------------------
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

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
app.use("/api/projects", projects);

// routes de la marketplace
app.use("/api/marketplace", marketplaceRoutes);
//  routes de paiement
app.use("/api/payments", paymentRoutes);
// routes de la Dashboard
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/arch", architectRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/quotes-invoices", quoteRoutes);
app.use("/api/events", eventRoutes);
//-----------------------------------------------------
app.get("/", (req, res) => {
  res.send("Hello, Roua! Express & MongoDB are working 🚀");
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
