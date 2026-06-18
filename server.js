const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

require("dotenv").config();

const app = express();

const corsOptions = {
    origin: [
        "http://localhost:5173",              // your local frontend
        "https://roshanly-frontend.vercel.app/"   // your deployed frontend (update this after deploying)
    ],
    credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

// connect database
connectDB();

app.get("/", (req, res) => {
    res.send("Backend + MongoDB Connected 🚀");
});


const authRoutes = require("./routes/authRoutes");

app.use("/api/auth", authRoutes);


const sessionRoutes = require("./routes/sessionRoutes");

app.use("/api/sessions", sessionRoutes);


const PORT = process.env.PORT || 5000;

app.use((err, req, res, next) => {
    res.status(500).json({ message: err.message || "Internal server error" });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
