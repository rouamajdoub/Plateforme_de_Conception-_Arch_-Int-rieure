// middleware/errorHandler.js

const { AppError } = require("../utils/customErrors");

/**
 * Global error handling middleware
 */
module.exports = (err, req, res, next) => {
  console.error("Error:", err);

  // If it's one of our custom errors
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message,
      ...err.extras
    });
  }

  // Handle JWT errors
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      success: false,
      error: "Token invalide"
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      error: "Session expirée, veuillez vous reconnecter"
    });
  }

  // Handle Mongoose validation errors
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map(val => val.message);
    return res.status(400).json({
      success: false,
      error: messages.join(", ")
    });
  }

  // Handle duplicate key errors
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      success: false,
      error: `${field} déjà utilisé`
    });
  }

  // Default to 500 server error
  res.status(500).json({
    success: false,
    error: "Erreur serveur"
  });
};