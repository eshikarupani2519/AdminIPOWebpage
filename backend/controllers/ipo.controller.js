const db = require("../models/db");

const path = require("path");
const fs = require("fs");

exports.getAllIPOs = async (req, res) => {
  try {
    const query = `
      SELECT i.*, c.logo, c.name AS company_name FROM ipos AS i 
      LEFT JOIN companies AS c ON i.company_id = c.id
      ORDER BY i.open_date DESC;
    `;
    const result = await db.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching IPOs' });
  }
};

exports.getNewListedIPOs = async (req, res) => {
  try {
    const query = `
      SELECT
        i.*,
        c.logo
      FROM
        ipos AS i
      LEFT JOIN
        companies AS c ON i.company_id = c.id
      WHERE
        i.status = 'New Listed'
      ORDER BY i.listing_date DESC;
    `;
    const result = await db.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching New Listed IPOs' });
  }
};

// =======================================================
// RECTIFIED registerIPO function
// =======================================================
exports.registerIPO = async (req, res) => {
  const client = await db.connect() // Get a client connection for the transaction
  
  try {
    console.log("Starting IPO registration...");
    console.log("Received files:", req.files);
    console.log("Received body:", req.body);
    
    // Extract data from the request body
    const {
      companyName, priceBand, open, close, issueSize, issueType,
      listingDate, status, ipoPrice, listingPrice, listingGain,
      cmp, currentReturn
    } = req.body;

    // Extract file names from req.files
    const logoFile = req.files?.logo?.[0]?.filename || null;
    const rhpFile = req.files?.rhp?.[0]?.filename || null;
    const drhpFile = req.files?.drhp?.[0]?.filename || null;
    
    // Begin the transaction
    await client.query("BEGIN");
    
    let companyId;
    
    // Check if the company already exists
    const companyCheckResult = await client.query(
      `SELECT id FROM companies WHERE name ILIKE $1`,
      [companyName]
    );

    if (companyCheckResult.rows.length > 0) {
      console.log("Company already exists, using existing companyId.");
      companyId = companyCheckResult.rows[0].id;
    } else {
      console.log("Company does not exist, inserting new company.");
      // Insert the new company and its logo filename
      const companyInsertResult = await client.query(
        `INSERT INTO companies (name, logo) VALUES ($1, $2) RETURNING id`,
        [companyName, logoFile]
      );
      companyId = companyInsertResult.rows[0].id;
      console.log("New company inserted with ID:", companyId);
    }
    
    // Now insert the new IPO details
    const result = await client.query(
      `INSERT INTO ipos (
        company_name, price_band, open_date, close_date, issue_size,
        issue_type, listing_date, status, ipo_price, listing_price,
        listing_gain, cmp, current_return, rhp, drhp, company_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) 
      RETURNING *`,
      [
        companyName, priceBand, open, close, issueSize,
        issueType, listingDate, status, ipoPrice, listingPrice,
        listingGain, cmp, currentReturn, rhpFile, drhpFile, companyId
      ]
    );
    
    // Commit the transaction if all queries succeed
    await client.query("COMMIT");
    
    console.log("IPO registration successful.");
    res.status(201).json(result.rows[0]);
    
  } catch (err) {
    // Rollback the transaction in case of any error
    await client.query("ROLLBACK");
    console.error("Error during IPO registration:", err);
    res.status(500).json({ message: "Internal Server Error during IPO registration." });
  } finally {
    // Always release the client connection
    client.release();
  }
};


exports.getIPOById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query(`
      SELECT
        i.*,
        c.logo,
        c.name AS company_name
      FROM ipos AS i
      LEFT JOIN companies AS c ON i.company_id = c.id
      WHERE i.id = $1
    `, [id]);
    const ipo = result.rows[0];

    if (!ipo) {
      return res.status(404).json({ error: 'IPO not found' });
    }
    res.json(ipo);
  } catch (error) {
    console.error('Error fetching IPO by ID:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.updateIPO = async (req, res) => {
  const client = await db.connect(); // Get a client connection for the transaction
  
  try {
    const { id } = req.params;
    const {
      companyName, priceBand, open, close, issueSize, issueType,
      listingDate, status, ipoPrice, listingPrice, listingGain,
      cmp, currentReturn
    } = req.body;

    const logoFile = req.files?.logo?.[0]?.filename || null;
    const rhpFilename = req.files?.rhp?.[0]?.filename || null;
    const drhpFilename = req.files?.drhp?.[0]?.filename || null;
    
    // Begin the transaction
    await client.query("BEGIN");

    const ipoResult = await client.query('SELECT company_id FROM ipos WHERE id = $1', [id]);
    if (ipoResult.rows.length === 0) {
      return res.status(404).json({ message: 'IPO not found' });
    }
    const companyId = ipoResult.rows[0].company_id;

    // Update the company's logo if a new one was uploaded
    if (logoFile) {
      await client.query(
        `UPDATE companies SET logo = $1 WHERE id = $2`,
        [logoFile, companyId]
      );
    }
    
    const updates = [];
    const values = [];
    let paramIndex = 1;

    // Company Details
    if (companyName !== undefined) { updates.push(`company_name = $${paramIndex++}`); values.push(companyName); }
    if (priceBand !== undefined) { updates.push(`price_band = $${paramIndex++}`); values.push(priceBand); }
    if (open !== undefined) { updates.push(`open_date = $${paramIndex++}`); values.push(open); }
    if (close !== undefined) { updates.push(`close_date = $${paramIndex++}`); values.push(close); }
    if (issueSize !== undefined) { updates.push(`issue_size = $${paramIndex++}`); values.push(issueSize); }
    if (issueType !== undefined) { updates.push(`issue_type = $${paramIndex++}`); values.push(issueType); }
    if (listingDate !== undefined) { updates.push(`listing_date = $${paramIndex++}`); values.push(listingDate); }
    if (status !== undefined) { updates.push(`status = $${paramIndex++}`); values.push(status); }

    // New Listed Details
    if (ipoPrice !== undefined) { updates.push(`ipo_price = $${paramIndex++}`); values.push(ipoPrice); }
    if (listingPrice !== undefined) { updates.push(`listing_price = $${paramIndex++}`); values.push(listingPrice); }
    if (listingGain !== undefined) { updates.push(`listing_gain = $${paramIndex++}`); values.push(listingGain); }
    if (cmp !== undefined) { updates.push(`cmp = $${paramIndex++}`); values.push(cmp); }
    if (currentReturn !== undefined) { updates.push(`current_return = $${paramIndex++}`); values.push(currentReturn); }

    // File fields - only update if a new file was uploaded
    if (rhpFilename !== null) { updates.push(`rhp = $${paramIndex++}`); values.push(rhpFilename); }
    if (drhpFilename !== null) { updates.push(`drhp = $${paramIndex++}`); values.push(drhpFilename); }

    if (updates.length > 0) {
      const query = `UPDATE ipos SET ${updates.join(', ')} WHERE id = $${paramIndex}`;
      values.push(id);
      await client.query(query, values);
    }

    await client.query("COMMIT");
    
    res.status(200).json({ message: 'IPO updated successfully' });
  } catch (err) {
    // Rollback the transaction in case of any error
    await client.query("ROLLBACK");
    console.error(err);
    res.status(500).json({ message: 'Failed to update IPO' });
  } finally {
    client.release();
  }
};


exports.deleteIPO = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query(`DELETE FROM ipos WHERE id = $1`, [id]);
    res.json({ message: 'IPO deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting IPO' });
  }
};

exports.uploadDocument = async (req, res) => {
  const file = req.file;
  if (!file) return res.status(400).json({ message: "No file uploaded" });

  try {
    await db.query("UPDATE ipos SET document_path=$1 WHERE id=$2", [file.filename, req.params.id]);
    res.json({ message: "Document uploaded" });
  } catch (err) {
    res.status(500).json({ message: "Failed to upload document" });
  }
};

exports.downloadDocument = async (req, res) => {
  try {
    const result = await db.query("SELECT document_path FROM ipos WHERE id=$1", [req.params.id]);
    const doc = result.rows[0];
    if (!doc || !doc.document_path) return res.status(404).json({ message: "No document found" });

    const filePath = path.join(__dirname, "..", "uploads", doc.document_path);
    res.download(filePath);
  } catch (err) {
    res.status(500).json({ message: "Download failed" });
  }
};

exports.deleteDocument = async (req, res) => {
  try {
    const result = await db.query("SELECT document_path FROM ipos WHERE id=$1", [req.params.id]);
    const doc = result.rows[0];
    if (!doc || !doc.document_path) return res.status(404).json({ message: "No document found" });

    const filePath = path.join(__dirname, "..", "uploads", doc.document_path);
    fs.unlinkSync(filePath);

    await db.query("UPDATE ipos SET document_path = NULL WHERE id = $1", [req.params.id]);
    res.json({ message: "Document deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete document" });
  }
};

exports.checkCompanyExists = async (req, res) => {
  const companyName = req.query.name;
  if (!companyName) {
    return res.status(400).json({ message: "Company name is required." });
  }
  try {
    const result = await db.query(
      `SELECT id FROM companies WHERE name ILIKE $1`,
      [companyName]
    );
    res.status(200).json({ exists: result.rows.length > 0 });
  } catch (err) {
    res.status(500).json({ message: "Server error during company check." });
  }
};

exports.searchIPOs = async (req, res) => {
  const searchTerm = req.query.keyword || ''; 
  const keyword = `%${searchTerm}%`; 

  console.log("Received search keyword:", searchTerm);

  try {
 // This query is confirmed to match your schema
 const query = `SELECT
i.*,
c.logo,
c.name AS company_name
FROM
ipos AS i
 LEFT JOIN
companies AS c ON i.company_id = c.id
 WHERE
 i.company_name ILIKE $1 
 OR c.name ILIKE $1
OR i.status ILIKE $1 
ORDER BY i.listing_date DESC;
`;
console.log("Executing SQL query with parameters:", [keyword]);
const result = await db.query(query, [keyword]);
 console.log("Query returned", result.rows.length, "results.");
 console.log("Here are the results:", result.rows);
res.json(result.rows);
} catch (err) {
console.error('An error was logged.');
res.status(500).json({ message: 'Error searching IPOs', details: err.message });
 }
};

exports.getUpcomingIPOs = async (req, res) => {
    try {
      const query = `
        SELECT i.*, c.logo, c.name AS company_name
        FROM ipos AS i
        LEFT JOIN companies AS c ON i.company_id = c.id
        WHERE i.status = 'Upcoming'
        ORDER BY i.open_date ASC;
      `;
      const result = await db.query(query);
      res.json(result.rows);
      console.log("Query returned", result.rows.length, "results.");
    console.log("Here are the results:", result.rows);
    
    } catch (err) {
      console.error('Error fetching upcoming IPOs:', err);
      res.status(500).json({ message: 'Error fetching upcoming IPOs' });
    }
  };
  
  
  exports.getOngoingIPOs = async (req, res) => {
    try {
      const query = `
        SELECT i.*, c.logo, c.name AS company_name
        FROM ipos AS i
        LEFT JOIN companies AS c ON i.company_id = c.id
        WHERE i.status = 'Ongoing'
        ORDER BY i.close_date ASC;
      `;
      const result = await db.query(query);
      res.json(result.rows);
    } catch (err) {
      console.error('Error fetching ongoing IPOs:', err);
      res.status(500).json({ message: 'Error fetching ongoing IPOs' });
    }
  };