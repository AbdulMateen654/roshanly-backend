const express = require("express");
const router = express.Router();
const { createSession, getSessions, deleteSession, summarizeSession, generateQuizForSession } = require("../controllers/sessionController");
const protect = require("../middleware/authMiddleware");

router.post("/create", protect, createSession);
router.get("/:userId", protect, getSessions);
router.delete("/:id", protect, deleteSession);
router.post("/summarize/:id", protect, summarizeSession);
router.post("/quiz/:id", protect, generateQuizForSession);

module.exports = router;