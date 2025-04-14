// Routes for Architect Clients
const express = require("express");
const { protect, restrictTo } = require("../middlewares/authMiddleware");
const clientController = require("../controllers/clientController");

const router = express.Router();

// Protect routes, allowing only authenticated architects
router.use(protect, restrictTo("architect"));

// CRUD routes for architect clients
router.post("/", clientController.createClient);
router.get("/", clientController.getClients);
router.put("/:id", clientController.updateClient);
router.delete("/:id", clientController.deleteClient);
router.get("/search/:query", clientController.searchClients);
router.get("/:id", clientController.getClientById);

module.exports = router;
