require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cookieParser());

app.set("trust proxy", 1); // si t'es derrière un proxy (nginx, etc.)
app.use(
  cors({
    // origin: process.env.CLIENT_URL || "http://localhost:3000",
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// routes
const authRoutes = require("./routes/authRoutes");
const authMiddleware = require("./middleware/authMiddleware");
app.use("/api/auth", authRoutes);

// health
app.get("/health", (req, res) => res.json({ ok: true }));
app.get("/test", (req, res) => res.json({ message: "Test route is working!" }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server on ${PORT}`));
