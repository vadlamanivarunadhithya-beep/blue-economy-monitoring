const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Access denied. Please log in.",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        message: "Authentication is not configured",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({
        message: "User no longer exists. Please log in again.",
      });
    }

    req.user = user;

    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError" ||
        error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Invalid or expired token. Please log in again.",
      });
    }

    console.error("Authentication error:", error);

    return res.status(500).json({
      message: "Authentication failed",
    });
  }
};

const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== "Admin") {
    return res.status(403).json({
      message: "Access denied. Admin permission required.",
    });
  }

  next();
};

module.exports = { protect, adminOnly };