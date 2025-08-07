// const express = require("express");
// const router = express.Router();
// const db = require("../models/db");
// const authenticate = require("../middleware/auth.middleware");
// const authorize = require("../middleware/role.middleware");
// const adminController = require("../controllers/admin.controller");

// router.get("/stats", authenticate, authorize("admin"), async (req, res) => {
//   try {
//     const ipoCount = await db.query("SELECT COUNT(*) FROM ipos");
//     const companyCount = await db.query("SELECT COUNT(*) FROM companies");
//     res.json({
//       ipos: parseInt(ipoCount.rows[0].count),
//       companies: parseInt(companyCount.rows[0].count),
//     });
//   } catch (err) {
//     res.status(500).json({ message: "Failed to load stats" });
//   }
// });
// router.get("/logs", authenticate, authorize("admin"), adminController.getLogs);

// module.exports = router;


const express = require("express");
const router = express.Router();
const db = require("../models/db");
const authenticate = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middleware");
const adminController = require("../controllers/admin.controller");

router.get("/stats", authenticate, authorize("admin"), async (req, res) => {
  try {
    // Queries for the IPO Dashboard India section
    const totalIposResult = await db.query("SELECT COUNT(*) FROM ipos");

    // Example 2: If you have 'listing_price' and 'issue_price' columns:
    const iposInGainResult = await db.query("SELECT COUNT(*) FROM ipos WHERE cmp > ipo_price");
    const iposInLossResult = await db.query("SELECT COUNT(*) FROM ipos WHERE cmp < ipo_price");

    // Queries for the Main Board IPO Doughnut Chart
    // These queries might also need to be adjusted if your 'status' column has different values
    const upcomingIposResult = await db.query("SELECT COUNT(*) FROM ipos WHERE status = 'coming'");
    const newListedIposResult = await db.query("SELECT COUNT(*) FROM ipos WHERE status = 'New Listed'");
    const ongoingIposResult = await db.query("SELECT COUNT(*) FROM ipos WHERE status = 'ongoing'");

    // Combine all the data into the correct JSON format
    const stats = {
      ipoDashboard: {
        totalIpos: parseInt(totalIposResult.rows[0].count),
        iposInGain: parseInt(iposInGainResult.rows[0].count),
        iposInLoss: parseInt(iposInLossResult.rows[0].count),
      },
      mainBoardIpo: {
        upcoming: parseInt(upcomingIposResult.rows[0].count),
        newListed: parseInt(newListedIposResult.rows[0].count),
        ongoing: parseInt(ongoingIposResult.rows[0].count),
      },
    };
    
    res.json(stats);
    
  } catch (err) {
    console.error("Error fetching dashboard stats:", err);
    res.status(500).json({ message: "Failed to load dashboard stats" });
  }
});
router.get("/logs", authenticate, authorize("admin"), adminController.getLogs);

module.exports = router;