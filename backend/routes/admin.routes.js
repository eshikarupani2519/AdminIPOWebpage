const express = require("express");
const router = express.Router();
const db = require("../models/db");
const authenticate = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middleware");
const adminController = require("../controllers/admin.controller");

router.get("/stats", authenticate, authorize("admin"), async (req, res) => {
  try {
    const ipoCount = await db.query("SELECT COUNT(*) FROM ipos");
    const companyCount = await db.query("SELECT COUNT(*) FROM companies");
    res.json({
      ipos: parseInt(ipoCount.rows[0].count),
      companies: parseInt(companyCount.rows[0].count),
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to load stats" });
  }
});
router.get("/logs", authenticate, authorize("admin"), adminController.getLogs);

module.exports = router;
