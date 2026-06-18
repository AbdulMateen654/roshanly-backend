const Session = require("../models/Session");
const { summarizeText, generateQuiz } = require("../services/openRouterService");

const createSession = async (req, res) => {
    try {
        const { userId, sessionTitle } = req.body;
        const session = await Session.create({ userId, sessionTitle });
        res.status(201).json(session);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getSessions = async (req, res) => {
    try {
        const sessions = await Session.find({ userId: req.params.userId }).sort({ createdAt: -1 });
        res.json(sessions);
    } catch (error) {
        res.status(500).json({ message: "Error fetching sessions" });
    }
};

const deleteSession = async (req, res) => {
    try {
        await Session.findByIdAndDelete(req.params.id);
        res.json({ message: "Session deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting session" });
    }
};

const summarizeSession = async (req, res) => {
    try {
        const { text } = req.body;
        const result = await summarizeText(text);
        const session = await Session.findByIdAndUpdate(
            req.params.id,
            { aiTitle: result.title, summary: result.summary },
            { new: true }
        );
        res.json({ session });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const generateQuizForSession = async (req, res) => {
    try {
        const session = await Session.findById(req.params.id);
        if (!session) return res.status(404).json({ message: "Session not found" });
        if (!session.summary?.length) return res.status(400).json({ message: "Please generate a summary first" });

        const quiz = await generateQuiz(session.summary);
        const updated = await Session.findByIdAndUpdate(req.params.id, { quiz }, { new: true });
        res.json({ session: updated });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createSession, getSessions, deleteSession, summarizeSession, generateQuizForSession };