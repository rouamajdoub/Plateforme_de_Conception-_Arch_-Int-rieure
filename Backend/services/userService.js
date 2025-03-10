// services/userService.js

const User = require("../models/User");
const crypto = require("crypto");
const { NotFoundError, ValidationError } = require("../utils/customErrors");

class UserService {
  /**
   * Create a new user
   * @param {Object} userData - User data
   * @returns {Object} Created user and email token
   */
  async createUser(userData) {
    // Check if email already exists
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      throw new ValidationError("Email déjà utilisé");
    }

    // Ensure isVerified is false for new users
    userData.isVerified = false;

    // Create the user
    const user = new User(userData);

    // Generate email verification token
    const emailToken = crypto.randomBytes(32).toString("hex");
    user.emailToken = emailToken;
    user.emailTokenExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    await user.save();

    return { user, emailToken };
  }

  /**
   * Get user profile by ID
   * @param {string} userId - User ID
   * @returns {Object} User profile
   */
  async getUserProfile(userId) {
    const user = await User.findById(userId).select("-password -authTokens");

    if (!user) {
      throw new NotFoundError("Utilisateur non trouvé");
    }

    return user;
  }

  /**
   * Update a user
   * @param {string} userId - User ID
   * @param {Object} updates - Fields to update
   * @returns {Object} Updated user
   */
  async updateUser(userId, updates) {
    // Prevent updating sensitive fields
    const safeUpdates = { ...updates };
    delete safeUpdates.password;
    delete safeUpdates.role;
    delete safeUpdates.authTokens;
    delete safeUpdates.isVerified;

    const user = await User.findByIdAndUpdate(userId, safeUpdates, {
      new: true,
      runValidators: true,
    }).select("-password -authTokens");

    if (!user) {
      throw new NotFoundError("Utilisateur non trouvé");
    }

    return user;
  }

  /**
   * Find user by specific criteria
   * @param {Object} criteria - Search criteria
   * @returns {Object} User object
   */
  async findUser(criteria) {
    return User.findOne(criteria).select("-password -authTokens");
  }
}

module.exports = new UserService();
