const authorizeRole = (role) => {
  return (req, res, next) => {
    console.log("🔐 User Role:", req.user.role)
    if (req.user.role !== role) {
      return res.status(403).json({ message: "Forbidden: Insufficient rights" });
    }
    next();
  };
};

module.exports = authorizeRole;
