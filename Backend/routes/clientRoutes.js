const express = require("express");
const { protect, restrictTo } = require("../middlewares/authMiddleware");
const clientController = require("../controllers/clientController");

const router = express.Router();

// Protect routes, allowing only authenticated architects
router.use(protect, restrictTo("architect"));

// CRUD routes for architect clients
router.post("/", clientController.createClient); // Create client
router.get("/", clientController.getClients); // Get all clients
router.put("/:id", clientController.updateClient); // Update client
router.delete("/:id", clientController.deleteClient); // Delete client
router.get("/search/:query", clientController.searchClients); // Search clients
router.get("/:id", clientController.getClientById); // Get client by ID
module.exports = router;
