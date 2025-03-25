const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * Middleware to protect routes that require authentication
 * Handles both JWT and Auth0 authentication
 */
exports.protect = async (req, res, next) => {
  try {
    // Auth0 handling
    if (req.oidc?.isAuthenticated()) {
      const user = await User.findOne({ 
        auth0Id: req.oidc.user.sub,
        authMethod: "auth0"
      });
      
      if (!user) {
        // Try to create the user if they don't exist
        try {
          const newUser = new User({
            auth0Id: req.oidc.user.sub,
            email: req.oidc.user.email,
            prenom: req.oidc.user.given_name || "",
            nomDeFamille: req.oidc.user.family_name || "",
            pseudo: req.oidc.user.nickname || req.oidc.user.name,
            profilePicture: req.oidc.user.picture,
            role: "client", // Only clients can use Auth0
            authMethod: "auth0",
            isVerified: true,
          });
          
          await newUser.save();
          req.user = newUser;
          return next();
        } catch (error) {
          throw new Error("Could not create Auth0 user");
        }
      }
      
      req.user = user;
      return next();
    }
    
    // JWT handling
    const authHeader = req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new Error("No token provided");
    }
    
    const token = authHeader.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user by ID, don't filter by authMethod to allow both types
    const user = await User.findById(decoded.id);
    
    if (!user) {
      throw new Error("User not found");
    }
    
    // Check if token exists in user's authTokens array
    if (!user.authTokens.some(t => t.token === token)) {
      throw new Error("Invalid token");
    }
    
    req.user = user;
    req.token = token; // Store token for potential logout
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      error: "Authentification requise: " + (error.message || "Token invalide")
    });
  }
};

/**
 * Middleware to restrict access based on user roles
 * @param {...string} roles - Allowed roles
 */
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: "Vous n'avez pas la permission d'effectuer cette action",
      });
    }
    next();
  };
};

/**
 * Middleware to check for verified status
 */
exports.requireVerified = (req, res, next) => {
  if (!req.user.isVerified) {
    return res.status(403).json({
      success: false,
      error: "Votre compte n'est pas vérifié. Veuillez vérifier votre email.",
    });
  }
  next();
};

/**
 * Middleware to check for architect approval
 */
exports.requireApproved = (req, res, next) => {
  if (req.user.role === "architect" && req.user.status !== "approved") {
    return res.status(403).json({
      success: false,
      error: "Votre compte est en attente d'approbation par l'administrateur.",
    });
  }
  next();
};

/**
 * Middleware to ensure only clients can use Auth0
 */
exports.ensureCorrectAuthMethod = (req, res, next) => {
  // Architects must use local auth
  if (req.user.role === "architect" && req.user.authMethod !== "local") {
    return res.status(403).json({
      success: false,
      error: "Les architectes doivent utiliser l'authentification locale.",
    });
  }
  
  next();
};