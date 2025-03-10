// services/architectService.js

const User = require("../models/User");
const Subscription = require("../models/Subscriptions");
const { NotFoundError, AuthorizationError } = require("../utils/customErrors");

class ArchitectService {
  /**
   * Validate or reject an architect
   * @param {string} architectId - Architect user ID
   * @param {boolean} approved - Whether to approve or reject
   * @param {string} reason - Rejection reason if applicable
   * @param {string} adminId - Admin user ID performing the action
   * @returns {Object} Updated architect user
   */
  async validateArchitect(architectId, approved, reason, adminId) {
    // Verify admin privileges
    const admin = await User.findById(adminId);
    if (!admin || admin.role !== "admin") {
      throw new AuthorizationError(
        "Seuls les administrateurs peuvent valider les architectes"
      );
    }

    // Find the architect
    const architect = await User.findOne({
      _id: architectId,
      role: "architect",
    });
    if (!architect) {
      throw new NotFoundError("Architecte non trouvé");
    }

    // Update status
    architect.status = approved ? "approved" : "rejected";
    if (!approved) {
      architect.rejectionReason = reason;
    }

    await architect.save();
    return architect;
  }

  /**
   * Create subscription for architect
   * @param {string} architectId - Architect user ID
   * @param {Object} subscriptionData - Subscription details
   * @returns {Object} Created subscription
   */
  async createSubscription(architectId, subscriptionData) {
    const architect = await User.findOne({
      _id: architectId,
      role: "architect",
    });
    if (!architect) {
      throw new NotFoundError("Architecte non trouvé");
    }

    const subscription = new Subscription({
      architectId,
      plan: subscriptionData.plan || "Free",
      startDate: Date.now(),
      endDate:
        subscriptionData.endDate || Date.now() + 30 * 24 * 60 * 60 * 1000,
      price: subscriptionData.price || 0,
      paymentMethod: subscriptionData.paymentMethod || "Free",
    });

    const savedSubscription = await subscription.save();

    // Update architect with subscription reference
    architect.subscription = savedSubscription._id;
    await architect.save();

    return savedSubscription;
  }

  /**
   * Get pending architects for admin review
   * @returns {Array} List of pending architects
   */
  async getPendingArchitects() {
    return User.find({
      role: "architect",
      status: "pending",
    }).select("-password -authTokens");
  }

  /**
   * Get architect details
   * @param {string} architectId - Architect ID
   * @returns {Object} Architect with subscription details
   */
  async getArchitectDetails(architectId) {
    const architect = await User.findOne({
      _id: architectId,
      role: "architect",
    })
      .select("-password -authTokens")
      .populate("subscription");

    if (!architect) {
      throw new NotFoundError("Architecte non trouvé");
    }

    return architect;
  }
}

module.exports = new ArchitectService();
