require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const User = require("./models/User");
const bodyParser = require("body-parser");
const path = require("path");

const asyncHandler = require("express-async-handler");
const cookieParser = require("cookie-parser");
const { auth } = require("express-openid-connect");
const userRoutes = require("./routes/userRoutes");
const subscriptionRoutes = require("./routes/subscriptionRoutes");
const projects = require("./routes/projectsRoutes");
const marketplaceRoutes = require("./routes/marketplaceRoutes");
const kanbanRoutes = require("./routes/kanbanRoutes");
const reviewRoutes = require("./routes/reviewsRoutes");
const architectRoutes = require("./routes/architectRoutes");
const statsRoutes = require("./routes/statsRoutes");
const quoteRoutes = require("./routes/QuoteRoutes");
const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");
const profileRoutes = require("./routes/profileRoutes");
const clientRoutes = require("./routes/clientRoutes");

// --------------------Stripe -----------------------
const webhookRoutes = require("./Stripe/webhook/route");
const paymentRoutes = require("./routes/paymentRoutes");

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
  })
);

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Auth0 Configuration
const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.SECRET,
  baseURL: process.env.BASE_URL,
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,

  issuerBaseURL: process.env.ISSUER_BASE_URL,
  authorizationParams: {
    response_type: "code",
    scope: "openid profile email",
  },
  routes: {
    callback: "/api/auth/callback",
    login: false,
  },
};
app.use(auth(config));

// Connect to Database
connectDB();

//--------------------------------------------Routes --------------------
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/clients", userRoutes);
app.use("/api/architects", userRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/arch-req", architectRoutes);
//archi dash
app.use("/api/stats", statsRoutes);
app.use("/api/marketplace", marketplaceRoutes);
app.use("/api/quotes-invoices", quoteRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/client-arch", clientRoutes);
app.use("/api/projects", projects);
app.use("/api/kanban", kanbanRoutes);

// ---------------------------Stripe webhook route--------------------
app.use(webhookRoutes);
app.use("/api/payments", paymentRoutes);

// ------------------------------Auth0 callback handling---------------------------------------
app.get("/", async (req, res) => {
  if (req.oidc.isAuthenticated()) {
    // Check if Auth0 user exists in the DB
    await ensureUserInDB(req.oidc.user);

    // Redirect to the frontend
    return res.redirect(process.env.FRONTEND_URL);
  } else {
    return res.send("Logged out");
  }
});

// Function to check if user exists in the DB and create if not
const ensureUserInDB = asyncHandler(async (user) => {
  try {
    const existingUser = await User.findOne({ auth0Id: user.sub });

    if (!existingUser) {
      // Create a new user document
      const newUser = new User({
        auth0Id: user.sub,
        email: user.email,
        prenom: user.given_name || "",
        nomDeFamille: user.family_name || "",
        pseudo: user.nickname || user.name,
        profilePicture: user.picture,
        role: "client",
        isVerified: true,
        authMethod: "auth0",
      });

      await newUser.save();
      console.log("User added to DB", user);
    } else {
      console.log("User already exists in DB", existingUser);
    }
  } catch (error) {
    console.log("Error checking or adding user to DB", error.message);
  }
});

// API status endpoint
app.get("/api/status", (req, res) => {
  res.status(200).json({ status: "Server is running" });
});

// Start the Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
