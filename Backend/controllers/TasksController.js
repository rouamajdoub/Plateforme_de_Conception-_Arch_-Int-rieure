const Task = require("../models/taskModel");

// Update createTask to automatically set the architect to the logged-in user
exports.createTask = async (req, res) => {
  try {
    const taskData = {
      ...req.body,
      architect: req.user._id, // Automatically set architect to current user
    };

    const task = new Task(taskData);
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update getAllTasks to only return tasks belonging to the architect
exports.getAllTasks = async (req, res) => {
  try {
    // If user is an architect, only return their tasks
    const filter =
      req.user.role === "architect" ? { architect: req.user._id } : {};

    const tasks = await Task.find(filter).populate(
      "architect",
      "nom prenom email"
    );
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update updateTask to only allow editing own tasks
exports.updateTask = async (req, res) => {
  try {
    // First find the task to check ownership
    const existingTask = await Task.findById(req.params.id);

    if (!existingTask) {
      return res.status(404).json({ error: "Tâche non trouvée" });
    }

    // Check if user is architect and trying to modify someone else's task
    if (
      req.user.role === "architect" &&
      existingTask.architect.toString() !== req.user._id.toString()
    ) {
      return res
        .status(403)
        .json({ error: "Vous n'êtes pas autorisé à modifier cette tâche" });
    }

    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update deleteTask to only allow deleting own tasks
exports.deleteTask = async (req, res) => {
  try {
    // First find the task to check ownership
    const existingTask = await Task.findById(req.params.id);

    if (!existingTask) {
      return res.status(404).json({ error: "Tâche non trouvée" });
    }

    // Check if user is architect and trying to delete someone else's task
    if (
      req.user.role === "architect" &&
      existingTask.architect.toString() !== req.user._id.toString()
    ) {
      return res
        .status(403)
        .json({ error: "Vous n'êtes pas autorisé à supprimer cette tâche" });
    }

    await Task.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
