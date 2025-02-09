const express = require("express");
const {
  getUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controllers/userController"); // Ensure this path is correct

const router = express.Router();

router.get("/", getUsers); // Ensure getUsers is defined
router.post("/", createUser); // Ensure createUser is defined
router.get("/:id", getUserById); // Ensure getUserById is defined
router.put("/:id", updateUser); // Ensure updateUser is defined
router.delete("/:id", deleteUser); // Ensure deleteUser is defined

module.exports = router;
