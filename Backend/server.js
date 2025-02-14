require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const subscriptionRoutes = require("./routes/subscriptionRoutes");
const projectsDatabaseRoutes = require("./routes/projects_dbRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Connect to MongoDB
connectDB();

// Mount user routes
app.use("/api/users", userRoutes);
app.use("/api/clients", userRoutes);
app.use("/api/architects", userRoutes);

// Mount subscription routes
app.use("/api/subscriptions", subscriptionRoutes);

// Mount projects database routes
app.use("/api/projectsDatabase", projectsDatabaseRoutes); // Ajout des routes des projets

// Root endpoint
app.get("/", (req, res) => {
  res.send("Hello, Roua! Express & MongoDB are working 🚀");
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
