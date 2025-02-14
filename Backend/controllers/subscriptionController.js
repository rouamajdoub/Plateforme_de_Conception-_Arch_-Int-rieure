// controllers/subscriptionController.js
const Subscription = require("../models/Subscriptions");

// Create a new subscription
exports.createSubscription = async (req, res) => {
  try {
    const subscription = new Subscription(req.body);
    await subscription.save();
    res.status(201).json(subscription);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all subscriptions
exports.getAllSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find().populate("architectId");
    res.status(200).json(subscriptions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a subscription by ID
exports.getSubscriptionById = async (req, res) => {
  try {
    const subscription = await Subscription.findById(req.params.id).populate(
      "architectId"
    );
    if (!subscription)
      return res.status(404).json({ message: "Subscription not found" });
    res.status(200).json(subscription);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a subscription
exports.updateSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!subscription)
      return res.status(404).json({ message: "Subscription not found" });
    res.status(200).json(subscription);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a subscription
exports.deleteSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findByIdAndDelete(req.params.id);
    if (!subscription)
      return res.status(404).json({ message: "Subscription not found" });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
