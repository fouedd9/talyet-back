require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { ROUTEX } = require("./routes/index");
const app = express();
app.use(express.json());
app.use(cookieParser());

app.set("trust proxy", 1); // si t'es derrière un proxy (nginx, etc.)
const allowedOrigins = [
  "http://localhost:5173", // ton front local
  "https://talyet-ujne.vercel.app", // ton site Vercel exact
  "https://talyet.vercel.app", // ton site Vercel exact
];
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

// routes
const authRoutes = require("./routes/authRoutes");
const authMiddleware = require("./middleware/authMiddleware");
const {
  getMyprofile,
  editMyProfile,
  editMyPhone,
} = require("./controllers/profileController");

app.use("/api/auth", authRoutes);
// app.use("/api/me", getMyprofile);
app.get(ROUTEX.PROFILE, authMiddleware, getMyprofile);
app.put(ROUTEX.PROFILE, authMiddleware, editMyProfile);

app.patch(ROUTEX.PROFILE, authMiddleware, editMyPhone);

// health
app.get("/health", (req, res) => res.json({ ok: true }));
app.get("/test", (req, res) => res.json({ message: "Test route is working!" }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running ✅ on ${PORT}`));
