const jwt = require("jsonwebtoken");
require("dotenv").config();

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
console.log("🧪 Authorization Header:", authHeader);
  const token = authHeader && authHeader.split(" ")[1];
  console.log("🧪 Extracted Token:", token); // Extract token from "Bearer <token>"
  if (!token) return res.status(401).json({ message: "Missing token" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
console.log("✅ Decoded Token Payload:", user);
    req.user = user; // Adds decoded token to request object
    next();
  });
};

module.exports = authenticateToken;
