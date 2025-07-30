const db = require("../models/db");
const pool = require("../models/db");
const path = require("path");
const fs = require("fs");


// exports.registerIPO = async (req, res) => {
//   const {
//     companyName, priceBand, open, close,
//     issueSize, issueType, listingDate, status,
//     ipoPrice, listingPrice, listingGain,
//     cmp, currentReturn, rhp, drhp
//   } = req.body;

//   try {
//     const ipoResult = await db.query(
//       `INSERT INTO ipos (company_name, price_band, open_date, close_date, issue_size, issue_type, listing_date, status)
//        VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id`,
//       [companyName, priceBand, open, close, issueSize, issueType, listingDate, status]
//     );

//     const ipoId = ipoResult.rows[0].id;

//     if (status === 'New Listed') {
//       await db.query(
//         `INSERT INTO ipo_details (ipo_id, ipo_price, listing_price, listing_gain, cmp, current_return, rhp, drhp)
//          VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
//         [ipoId, ipoPrice, listingPrice, listingGain, cmp, currentReturn, rhp, drhp]
//       );
//     }

//     res.status(201).json({ message: 'IPO registered successfully.' });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Server error while registering IPO.' });
//   }
// };

exports.getAllIPOs = async (req, res) => {
  try {
    const result = await db.query(`SELECT * FROM ipos`);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching IPOs' });
  }
};

exports.getNewListedIPOs = async (req, res) => {
  try {
    const result = await db.query(`SELECT * FROM ipos WHERE status = 'New Listed'`);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching New Listed IPOs' });
  }
};
exports.registerIPO = async (req, res) => {
  try {
    const data = req.body;
    const rhpFile = req.files?.rhp?.[0]?.filename || null;
    const drhpFile = req.files?.drhp?.[0]?.filename || null;

    const {
      companyName,
      priceBand,
      open,
      close,
      issueSize,
      issueType,
      listingDate,
      status,
      ipoPrice,
      listingPrice,
      listingGain,
      cmp,
      currentReturn
    } = data;

    const result = await db.query(
      `INSERT INTO ipos (
        company_name, price_band, open_date, close_date, issue_size,
        issue_type, listing_date, status, ipo_price, listing_price,
        listing_gain, cmp, current_return, rhp, drhp
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
      RETURNING *`,
      [
        companyName,
        priceBand,
        open,
        close,
        issueSize,
        issueType,
        listingDate,
        status,
        ipoPrice || null,
        listingPrice || null,
        listingGain || null,
        cmp || null,
        currentReturn || null,
        rhpFile,
        drhpFile
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getIPOById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('SELECT * FROM ipos WHERE id = $1', [id]);
    const ipo = result.rows[0];

    if (!ipo) {
      return res.status(404).json({ error: 'IPO not found' });
    }

    // Add an alias in the response for frontend compatibility
    // res.json({
    //   ...ipo,
    //   listed_date: ipo.listing_date  // 👈 this keeps Angular form happy
    // });
  } catch (error) {
    console.error('Error fetching IPO by ID:', error);
    res.status(500).json({ error: 'Server error' });
  }
};


// exports.updateIPO = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const {
//       companyName,
//       status,
//       listingDate,
//       priceBand,
//       lotSize,
//       exchange
//     } = req.body;
// console.log(companyName,
//       status,
//       listingDate,
//       priceBand,
//       lotSize,
//       exchange)
//     const rhpPdf = req.files?.rhpPdf?.[0]?.filename;
//     const drhpPdf = req.files?.drhpPdf?.[0]?.filename;

//     // 👇 Sample SQL update with optional files
//     await db.query(
//       `UPDATE ipos SET 
//         company_name = $1,
//         status = $2,
//         listing_date = $3,
//         price_band = $4,
//         lot_size = $5,
//         exchange = $6,
//         rhp_pdf = COALESCE($7, rhp_pdf),
//         drhp_pdf = COALESCE($8, drhp_pdf)
//       WHERE id = $9`,
//       [
//         companyName,
//         status,
//         listingDate,
//         priceBand,
//         lotSize,
//         exchange,
//         rhpPdf || null,
//         drhpPdf || null,
//         id
//       ]
//     );

//     res.status(200).json({ message: 'IPO updated successfully' });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Failed to update IPO' });
//   }
// };

exports.updateIPO = async (req, res) => {
  try {
    const { id } = req.params;
    // Extract ALL relevant fields from req.body based on your Angular forms
    const {
      companyName,
      priceBand,
      open, // Corresponds to open_date
      close, // Corresponds to close_date
      issueSize,
      issueType,
      listingDate,
      status,
      ipoPrice,
      listingPrice,
      listingGain,
      cmp,
      currentReturn
      // No lotSize or exchange in your Angular forms for IPO details, so remove them
    } = req.body;

    // Correctly get file names from req.files based on frontend's formData.append keys
    const rhpFilename = req.files?.rhp?.[0]?.filename || null;
    const drhpFilename = req.files?.drhp?.[0]?.filename || null;

    // Build the SET clause dynamically to handle optional fields and prevent updating nulls
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
    // listingDate is in both, but primarily 'companyDetails'
    if (listingDate !== undefined) { updates.push(`listing_date = $${paramIndex++}`); values.push(listingDate); }
    if (status !== undefined) { updates.push(`status = $${paramIndex++}`); values.push(status); }

    // New Listed Details (only update if status is 'New Listed' or if values are provided)
    // It's safer to always try to update these if they come from the form,
    // and let the frontend logic handle when they are sent.
    if (ipoPrice !== undefined) { updates.push(`ipo_price = $${paramIndex++}`); values.push(ipoPrice); }
    if (listingPrice !== undefined) { updates.push(`listing_price = $${paramIndex++}`); values.push(listingPrice); }
    if (listingGain !== undefined) { updates.push(`listing_gain = $${paramIndex++}`); values.push(listingGain); }
    if (cmp !== undefined) { updates.push(`cmp = $${paramIndex++}`); values.push(cmp); }
    if (currentReturn !== undefined) { updates.push(`current_return = $${paramIndex++}`); values.push(currentReturn); }

    // File fields - use correct column names (`rhp`, `drhp`)
    if (rhpFilename !== null) { updates.push(`rhp = $${paramIndex++}`); values.push(rhpFilename); }
    if (drhpFilename !== null) { updates.push(`drhp = $${paramIndex++}`); values.push(drhpFilename); }

    // If no updates are present, return early
    if (updates.length === 0) {
      return res.status(400).json({ message: 'No fields to update.' });
    }

    const query = `UPDATE ipos SET ${updates.join(', ')} WHERE id = $${paramIndex}`;
    values.push(id); // Add ID to the end of values for the WHERE clause

    await db.query(query, values);

    res.status(200).json({ message: 'IPO updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update IPO' });
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
exports.searchIPOs = async (req, res) => {
  const keyword = `%${req.query.q || ''}%`;
  const result = await db.query(
    `SELECT * FROM ipos WHERE company_name ILIKE $1 OR status ILIKE $1 ORDER BY listing_date DESC`,
    [keyword]
  );
  res.json(result.rows);
};