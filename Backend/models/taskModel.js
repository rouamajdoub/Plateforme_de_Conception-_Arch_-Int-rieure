const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    architect: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }, // Architecte assigné à la tâche
    title: { type: String, required: true },
    description: { type: String },
    status: {
      type: String,
      enum: ["todo", "in-progress", "done"],
      default: "todo",
    },
    dueDate: { type: Date },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);
