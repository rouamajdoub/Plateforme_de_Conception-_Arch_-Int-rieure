const Task = require("../models/taskModel");
const Event = require("../models/eventModel");
const Notification = require("../models/Notification");

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
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
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

// ✅ 5. Ajouter un événement
exports.createEvent = async (req, res) => {
  try {
    const event = new Event(req.body);
    await event.save();
    res.status(201).json(event);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ✅ 6. Récupérer tous les événements
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().populate("createdBy", "nom prenom email");
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ 7. Ajouter une notification
exports.createNotification = async (req, res) => {
  try {
    const notification = new Notification(req.body);
    await notification.save();
    res.status(201).json(notification);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ✅ 8. Récupérer toutes les notifications d'un utilisateur
exports.getUserNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.params.userId });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ 9. Marquer une notification comme lue
exports.markNotificationAsRead = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true });
    if (!notification) return res.status(404).json({ error: "Notification non trouvée" });
    res.json(notification);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
