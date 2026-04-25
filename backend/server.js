// server.js — Entry point for the Crypto App backend
// Connects to MongoDB and starts the Express server

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

// Load environment variables from .env BEFORE importing anything that uses them
dotenv.config();

// Import route files
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const cryptoRoutes = require("./routes/cryptoRoutes");

const app = express();

// --- CORS ---
// Allow requests from the local Vite dev server and the deployed Netlify URL
const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL, // set this in Render: https://your-app.netlify.app
].filter(Boolean); // remove undefined entries if FRONTEND_URL is not set

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// --- Body parsers ---
// Parse incoming JSON and URL-encoded request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Routes ---
// Auth routes: GET /api/register, GET /api/login
app.use("/api", authRoutes);

// User routes: GET /api/profile (protected)
app.use("/api", userRoutes);

// Crypto routes: GET /api/crypto, GET /api/crypto/gainers, GET /api/crypto/new, POST /api/crypto
app.use("/api/crypto", cryptoRoutes);

// --- Health check ---
// Visit the root URL to confirm the server is running (useful after deploying to Render)
app.get("/", (req, res) => {
  res.json({ message: "Crypto App API is running — student project by Andy Mensah" });
});

// --- Connect to MongoDB, then start server ---
const PORT = process.env.PORT || 5001;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1); // Exit if we can't connect to the database
  });
