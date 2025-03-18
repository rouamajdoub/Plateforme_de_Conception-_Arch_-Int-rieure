const jwt = require("jsonwebtoken");
const {
  AuthenticationError,
  AuthorizationError,
} = require("../utils/customErrors");

/**
 * Middleware to protect routes that require authentication
 */
exports.protect = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AuthenticationError("Accès non autorisé");
    }

    const token = authHeader.replace("Bearer ", "");

    // Verify token and decode
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Ensure you have JWT_SECRET in your .env file

    // Set user in request
    req.user = decoded;
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware to restrict access based on user roles
 * @param {...string} roles - Allowed roles
 */
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AuthorizationError(
          "Vous n'avez pas la permission d'effectuer cette action"
        )
      );
    }
    next();
  };
};
