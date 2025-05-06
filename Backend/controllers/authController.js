const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Register a new user (client or architect)
exports.register = asyncHandler(async (req, res) => {
  try {
    const {
      pseudo,
      nomDeFamille,
      prenom,
      email,
      password,
      phoneNumber,
      role,
      pays,
      region,
      city,
      cin,
      patenteNumber,
      companyName,
      experienceYears,
      specialization,
      portfolioURL,
      certifications,
      education,
      softwareProficiency,
      coordinates,
      website,
      socialMedia,
    } = req.body;

    console.log("Registration request body:", req.body);

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email déjà utilisé" });
    }

    if (role === "architect") {
      if (!cin || !patenteNumber) {
        return res.status(400).json({
          error: "CIN and Patente Number are required for architects.",
        });
      }
      if (!password || password.length < 8) {
        return res
          .status(400)
          .json({ error: "Password must be at least 8 characters long." });
      }
    }

    const userData = {
      pseudo,
      nomDeFamille,
      prenom,
      email,
      password,
      phoneNumber: phoneNumber || "",
      role,
      authMethod: "local",
      contentTerm: req.body.contentTerm || false,
      cgvAndCguTerm: req.body.cgvAndCguTerm || false,
      infoTerm: req.body.infoTerm || false,
      majorTerm: req.body.majorTerm || false,
      exterieurParticipantTerm: req.body.exterieurParticipantTerm || false,
      isVerified: true, // Auto-verify all users
    };

    if (role === "client") {
      userData.location = {
        country: pays || req.body.location?.country || "",
        region: region || req.body.location?.region || "",
        city: city || req.body.location?.city || "",
      };
    } else if (role === "architect") {
      userData.cin = cin;
      userData.patenteNumber = patenteNumber;
      userData.companyName = companyName || "";
      userData.experienceYears = experienceYears || 0;
      userData.specialization = Array.isArray(specialization)
        ? specialization
        : [specialization || ""];
      userData.portfolioURL = portfolioURL || "";
      userData.certifications = Array.isArray(certifications)
        ? certifications
        : certifications
        ? [certifications]
        : [];
      userData.education = education || "";
      userData.softwareProficiency = Array.isArray(softwareProficiency)
        ? softwareProficiency
        : softwareProficiency
        ? [softwareProficiency]
        : [];
      userData.website = website || "";
      userData.socialMedia = socialMedia || {};
      userData.status = "pending";
      userData.location = {
        country: pays || "",
        region: region || "",
        city: city || "",
        coordinates: coordinates
          ? {
              type: "Point",
              coordinates: coordinates,
            }
          : {
              type: "Point",
              coordinates: [0, 0],
            },
      };
    }

    const user = new User(userData);
    await user.save();

    res.status(201).json({
      success: true,
      message: "Compte créé avec succès.",
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "An error occurred during registration",
    });
  }
});

// Google Login
exports.googleLogin = asyncHandler(async (req, res) => {
  const { token } = req.body;

  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const { email, name, picture, given_name, family_name } = ticket.getPayload();

  let user = await User.findOne({ email });

  if (!user) {
    user = new User({
      pseudo: name,
      prenom: given_name || "",
      nomDeFamille: family_name || "",
      email,
      profilePicture: picture,
      role: "client",
      authMethod: "auth0",
      isVerified: true,
    });
    await user.save();
  }

  const jwtToken = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  user.authTokens.push({ token: jwtToken });
  await user.save();

  const userObject = user.toObject();
  delete userObject.password;
  delete userObject.authTokens;

  res.json({
    success: true,
    user: userObject,
    token: jwtToken,
  });
});

// Admin Registration
exports.registerAdmin = asyncHandler(async (req, res) => {
  try {
    const {
      pseudo,
      nomDeFamille,
      prenom,
      email,
      password,
      phoneNumber,
      adminPrivileges,
      superAdmin,
      adminSecretKey,
    } = req.body;

    // Verify admin secret key to prevent unauthorized admin creation
    if (adminSecretKey !== process.env.ADMIN_SECRET_KEY) {
      return res.status(403).json({
        success: false,
        error: "Invalid admin secret key. Admin creation not authorized.",
      });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email déjà utilisé" });
    }

    // Password validation
    if (!password || password.length < 8) {
      return res.status(400).json({
        error: "Password must be at least 8 characters long.",
      });
    }

    // Create admin user
    const adminData = {
      pseudo,
      nomDeFamille,
      prenom,
      email,
      password,
      phoneNumber: phoneNumber || "",
      role: "admin",
      authMethod: "local",
      isVerified: true,
      adminPrivileges: adminPrivileges || ["content-moderation"],
      superAdmin: superAdmin || false,
      isActive: true,
    };

    const admin = new User(adminData);
    await admin.save();

    // Generate JWT token for immediate login
    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    admin.authTokens.push({ token });
    await admin.save();

    const adminObject = admin.toObject();
    delete adminObject.password;
    delete adminObject.authTokens;

    res.status(201).json({
      success: true,
      message: "Admin account created successfully",
      token,
      user: adminObject,
    });
  } catch (error) {
    console.error("Admin registration error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "An error occurred during admin registration",
    });
  }
});

// Update your login function to handle admin login
exports.login = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Login attempt for:", email);

    const user = await User.findOne({ email }).select("+password");
    console.log("User found:", user ? "Yes" : "No");

    if (!user) {
      console.log("User not found with email:", email);
      return res
        .status(401)
        .json({ success: false, error: "Email or password incorrect" });
    }

    console.log("User role:", user.role);
    console.log("User status:", user.status);
    console.log("Auth method:", user.authMethod);

    if (user.authMethod === "auth0") {
      console.log("Auth0 login attempt - redirecting to Auth0");
      return res.status(401).json({
        success: false,
        error: "Please use Auth0 to log in",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password match:", isMatch);

    if (!isMatch) {
      console.log("Password mismatch for user:", email);
      return res
        .status(401)
        .json({ success: false, error: "Email ou mot de passe incorrect" });
    }

    // Extra check for architects
    if (user.role === "architect" && user.status !== "approved") {
      console.log("Architect not approved. Status:", user.status);
      return res.status(401).json({
        success: false,
        error: "Account pending approval",
      });
    }

    // Extra check for admins
    if (user.role === "admin" && !user.isActive) {
      console.log("Admin account inactive");
      return res.status(401).json({
        success: false,
        error: "Admin account inactive",
      });
    }

    // Check if this is the first login
    const isFirstLogin = !user.firstLogin;
    console.log("Is first login:", isFirstLogin);

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    user.authTokens.push({ token });

    // Only update firstLogin after successful authentication
    if (isFirstLogin) {
      user.firstLogin = true;
    }

    await user.save();
    console.log("User saved with token");

    const userObject = user.toObject();
    delete userObject.password;
    delete userObject.authTokens;

    res.status(200).json({
      success: true,
      token,
      user: userObject,
      isFirstLogin: isFirstLogin,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "An error occurred during login",
    });
  }
});
// Get Profile
exports.getProfile = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    // Find user by ID or auth0Id
    const user = await User.findOne({
      $or: [{ _id: id }, { auth0Id: id }],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return user profile (excluding sensitive data)
    const userProfile = user.toObject();
    delete userProfile.password;
    delete userProfile.authTokens;

    return res.status(200).json(userProfile);
  } catch (error) {
    console.log("Error in getProfile: ", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

// Logout
exports.logout = asyncHandler(async (req, res) => {
  if (req.oidc?.isAuthenticated()) {
    return res.oidc.logout({ returnTo: process.env.FRONTEND_URL });
  }

  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) return res.status(404).json({ error: "Utilisateur non trouvé" });

    user.authTokens = user.authTokens.filter((t) => t.token !== token);
    await user.save();

    res.json({ success: true, message: "Déconnexion réussie" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Check Auth Status
exports.checkAuth = asyncHandler(async (req, res) => {
  if (req.oidc?.isAuthenticated()) {
    const user = await User.findOne({
      auth0Id: req.oidc.user.sub,
      authMethod: "auth0",
    });
    return res.json({ isAuthenticated: true, authMethod: "auth0", user });
  }

  const authHeader = req.header("Authorization");
  if (authHeader?.startsWith("Bearer ")) {
    try {
      const token = authHeader.replace("Bearer ", "");
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      if (user)
        return res.json({ isAuthenticated: true, authMethod: "jwt", user });
    } catch (error) {
      // Invalid token
    }
  }

  res.json({ isAuthenticated: false, user: {} });
});
