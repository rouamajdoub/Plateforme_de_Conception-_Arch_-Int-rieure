const Task = require("../models/taskModel");

// ✅ 1. Ajouter une tâche
exports.createTask = async (req, res) => {
  try {
    const task = new Task(req.body);
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ✅ 2. Récupérer toutes les tâches
exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find().populate("architect", "nom prenom email");
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ 3. Modifier une tâche
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!task) return res.status(404).json({ error: "Tâche non trouvée" });
    res.json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ✅ 4. Supprimer une tâche
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ error: "Tâche non trouvée" });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
