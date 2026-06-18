const express = require("express");
const router = express.Router();
const { signup, login, deleteAccount } = require("../controllers/authController");
const protect = require("../middleware/authMiddleware");

router.post("/signup", signup);
router.post("/login", login);
router.delete("/delete/:id", protect, deleteAccount);

module.exports = router;