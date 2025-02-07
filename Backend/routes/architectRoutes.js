const express = require("express");
const {
  getArchitects,
  createArchitect,
  getArchitectById,
  updateArchitect,
  deleteArchitect,
} = require("../controllers/architectController");

const router = express.Router();

router.get("/", getArchitects);
router.post("/", createArchitect);
router.get("/:id", getArchitectById);
router.put("/:id", updateArchitect);
router.delete("/:id", deleteArchitect);

module.exports = router;
