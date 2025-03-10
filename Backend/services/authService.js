// services/authService.js

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/User");
const { AuthenticationError, ValidationError, NotFoundError } = require("../utils/customErrors");

class AuthService {
  /**
   * Authenticate a user with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Object} User and token
   */
  async authenticateUser(email, password) {
    // Find user by email and include password
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      throw new AuthenticationError("Email ou mot de passe incorrect");
    }

    // Check if password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new AuthenticationError("Email ou mot de passe incorrect");
    }

    // Check if email is verified
    if (!user.isVerified) {
      throw new ValidationError("Veuillez vérifier votre email avant de vous connecter", {
        emailVerification: true,
      });
    }

    // Generate JWT token
    const token = this.generateAuthToken(user);

    // Store token in user's authTokens array
    user.authTokens = user.authTokens || [];
    user.authTokens.push({
      token,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });

    // Limit stored tokens to prevent database bloat
    if (user.authTokens.length > 5) {
      user.authTokens = user.authTokens.slice(-5);
    }

    await user.save();

    // Remove sensitive data
    const userObject = user.toObject();
    delete userObject.password;
    delete userObject.authTokens;

    return { user: userObject, token };
  }

  /**
   * Generate JWT token for user
   * @param {Object} user - User object
   * @returns {string} JWT token
   */
  generateAuthToken(user) {
    const expiresIn = "7d";
    return jwt.sign(
      {
        id: user._id,
        role: user.role,
        iat: Math.floor(Date.now() / 1000),
      },
      process.env.JWT_SECRET,
      { expiresIn }
    );
  }

  /**
   * Verify email token
   * @param {string} token - Email verification token
   * @returns {Object} Updated user
   */
  async verifyEmail(token) {
    const user = await User.findOne({
      emailToken: token,
      emailTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      throw new ValidationError("Lien invalide ou expiré");
    }

    user.isVerified = true;
    user.emailToken = undefined;
    user.emailTokenExpires = undefined;
    await user.save();

    return user;
  }

  /**
   * Logout a user by invalidating their token
   * @param {string} userId - User ID
   * @param {string} token - JWT token to invalidate
   * @returns {boolean} Success status
   */
  async logout(userId, token) {
    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError("Utilisateur non trouvé");
    }

    user.authTokens = user.authTokens.filter((tokenObj) => tokenObj.token !== token);
    await user.save();

    return true;
  }

  /**
   * Create a password reset token
   * @param {string} email - User email
   * @returns {Object} Reset token and user
   */
  async createPasswordResetToken(email) {
    const user = await User.findOne({ email });
    if (!user) {
      // For security, we don't want to reveal if the user exists
      return null;
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    return { resetToken, user };
  }

  /**
   * Reset user password
   * @param {string} token - Reset token
   * @param {string} newPassword - New password
   * @returns {boolean} Success status
   */
  async resetPassword(token, newPassword) {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      throw new ValidationError("Le lien de réinitialisation est invalide ou a expiré");
    }

    // Update password
    user.password = newPassword; // Will be hashed by pre-save hook
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    // Invalidate all existing auth tokens for security
    user.authTokens = [];

    await user.save();

    return true;
  }

  /**
   * Check if a token is valid
   * @param {string} token - JWT token
   * @returns {Object} Decoded token
   */
  verifyToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      throw new AuthenticationError("Token invalide");
    }
  }
}

module.exports = new AuthService();