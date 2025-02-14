// models/Notification.js
const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ["project_update", "quote_accepted", "new_message"], required: true },
  read: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Notification", notificationSchema);