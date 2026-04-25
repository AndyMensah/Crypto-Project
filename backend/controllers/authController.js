// controllers/authController.js — Handles user registration and login

const User = require("../models/User");
const jwt = require("jsonwebtoken");

/**
 * generateToken — creates a signed JWT for a given user ID.
 * The token expires in 30 days and is signed with JWT_SECRET from .env.
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

/**
 * registerUser — GET /api/register
 *
 * Accepts: name, email, password
 * Reads from req.body first, falls back to req.query (supports both JSON body and query params)
 *
 * NOTE: The assignment specifies GET method for register. This is unusual (normally POST),
 * but we follow the spec. Credentials are sent as a JSON body via axios { data: {...} }
 * which works even on GET requests, or as query params ?name=...&email=...&password=...
 */
const registerUser = async (req, res) => {
  // Support body (preferred) and query params
  const name = req.body.name || req.query.name;
  const email = req.body.email || req.query.email;
  const password = req.body.password || req.query.password;

  // Validate all required fields are present
  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ message: "Please provide name, email, and password" });
  }

  try {
    // Check if a user with this email already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "An account with this email already exists" });
    }

    // Create the user — password is automatically hashed by the pre-save hook in User.js
    const user = await User.create({ name, email, password });

    // Return the new user's info along with a JWT token
    return res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error during registration", error: error.message });
  }
};

/**
 * loginUser — GET /api/login
 *
 * Accepts: email, password
 * Returns a JWT token if credentials are correct.
 */
const loginUser = async (req, res) => {
  const email = req.body.email || req.query.email;
  const password = req.body.password || req.query.password;

  if (!email || !password) {
    return res.status(400).json({ message: "Please provide email and password" });
  }

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    // Check user exists AND password matches the stored hash
    if (user && (await user.matchPassword(password))) {
      return res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      return res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error during login", error: error.message });
  }
};

module.exports = { registerUser, loginUser };
