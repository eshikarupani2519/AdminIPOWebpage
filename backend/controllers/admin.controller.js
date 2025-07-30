const db = require("../models/db");

exports.getStats = async (req, res) => {
  try {
    const ipos = await db.query("SELECT COUNT(*) FROM ipos");
    const companies = await db.query("SELECT COUNT(*) FROM companies");
    res.json({
      totalIPOs: parseInt(ipos.rows[0].count),
      totalCompanies: parseInt(companies.rows[0].count)
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch stats" });
  }
};

exports.getLogs = async (req, res) => {
  try {
    const logs = await db.query("SELECT * FROM logs ORDER BY timestamp DESC");
    res.json(logs.rows);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch logs" });
  }
};
