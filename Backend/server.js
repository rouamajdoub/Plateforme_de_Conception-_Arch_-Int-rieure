require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const connectDB = require("./config/db");
const User = require("./models/User");
const asyncHandler = require("express-async-handler");
const cookieParser = require("cookie-parser");
const { auth } = require("express-openid-connect");
const authRouter = require('./routes/authRouter'); // Adjust path as needed

// Stripe setup
const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

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
app.use(express.urlencoded({ extended: true }));

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
    callback: "/api/auth/callback", // Add callback route
    login: false,
  },
};
app.use(auth(config)); // Auth0 authentication middleware

// Connect to Database
connectDB();

// Explicitly mount authentication routes
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

// Auto Load other Routes from 'routes' folder
const routeFiles = fs.readdirSync(path.join(__dirname, "routes"));
routeFiles.forEach((file) => {
  if (file.endsWith(".js") && file !== "authRoutes.js") {
    console.log(`Loading route: ${file}`); 

    const route = require(`./routes/${file}`);
    let routeName = file.replace(".js", "").toLowerCase();

    // Handle special cases
    if (routeName === "quoteroutes") routeName = "quotes-invoices";
    if (routeName === "useroutes") routeName = "users";
    if (routeName === "architectroutes") routeName = "architects";
    app.use(`/api/${routeName}`, route);
  }
});



const projectRoutes = require('./routes/projectsRoutes');
app.use('/api/projects', projectRoutes);
app.use('/api/auth', authRouter);


// Auth0 callback handling
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
        authMethod: "auth0", // Add this line
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
