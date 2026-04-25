// middleware/authMiddleware.js — JWT verification middleware
// Use this as a middleware on any route that requires the user to be logged in

const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * protect — verifies the JWT token in the Authorization header.
 *
 * Expected header format:  Authorization: Bearer <token>
 *
 * If valid → sets req.user to the logged-in user and calls next()
 * If invalid/missing → returns 401 Unauthorised
 */
const protect = async (req, res, next) => {
  let token;

  // Check if the Authorization header exists and starts with "Bearer"
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Extract the token part (everything after "Bearer ")
      token = req.headers.authorization.split(" ")[1];

      // Verify the token using our secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach the user to req so controllers can access it
      // .select("-password") means "return all fields EXCEPT the password"
      req.user = await User.findById(decoded.id).select("-password");

      next(); // Token is valid — continue to the route handler
    } catch (error) {
      return res.status(401).json({ message: "Not authorised, token failed" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorised, no token provided" });
  }
};

module.exports = { protect };
