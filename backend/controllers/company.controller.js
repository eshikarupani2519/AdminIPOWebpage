const db = require("../models/db");

exports.getAllCompanies = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM companies ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch companies" });
  }
};

exports.getCompanyById = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM companies WHERE id = $1", [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ message: "Company not found" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch company" });
  }
};

exports.createCompany = async (req, res) => {
  const { name, industry, ceo, headquarters, founded_year, website } = req.body;
  try {
    await db.query(
      "INSERT INTO companies (name, industry, ceo, headquarters, founded_year, website) VALUES ($1, $2, $3, $4, $5, $6)",
      [name, industry, ceo, headquarters, founded_year, website]
    );
    res.status(201).json({ message: "Company created" });
  } catch (err) {
    res.status(500).json({ message: "Failed to create company" });
  }
};

exports.updateCompany = async (req, res) => {
  const { name, industry, ceo, headquarters, founded_year, website } = req.body;
  try {
    await db.query(
      "UPDATE companies SET name = $1, industry = $2, ceo = $3, headquarters = $4, founded_year = $5, website = $6 WHERE id = $7",
      [name, industry, ceo, headquarters, founded_year, website, req.params.id]
    );
    res.json({ message: "Company updated" });
  } catch (err) {
    res.status(500).json({ message: "Failed to update company" });
  }
};

exports.deleteCompany = async (req, res) => {
  try {
    await db.query("DELETE FROM companies WHERE id = $1", [req.params.id]);
    res.json({ message: "Company deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete company" });
  }
};
