// models/Task.js
const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  description: { type: String },
  status: {
    type: String,
    enum: ["todo", "in-progress", "done"],
    default: "todo",
  },
  dueDate: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Task", taskSchema);
