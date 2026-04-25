// routes/authRoutes.js — Authentication routes

const express = require("express");
const router = express.Router();
const { registerUser, loginUser } = require("../controllers/authController");

// NOTE: The assignment specifies GET method for both register and login.
// While REST convention would normally use POST, we follow the assignment spec.
// Credentials are sent as a JSON body (via axios { data: {...} }) or as query params.

// GET /api/register — create a new user account
router.get("/register", registerUser);

// GET /api/login — authenticate and receive a JWT token
router.get("/login", loginUser);

module.exports = router;
