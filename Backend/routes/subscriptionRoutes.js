// routes/subscriptionRoutes.js
const express = require("express");
const router = express.Router();
const subscriptionController = require("../controllers/subscriptionController");

// Define routes
router.post("/", subscriptionController.createSubscription);
router.get("/", subscriptionController.getAllSubscriptions);
router.get("/:id", subscriptionController.getSubscriptionById);
router.put("/:id", subscriptionController.updateSubscription);
router.delete("/:id", subscriptionController.deleteSubscription);

module.exports = router;
