const express = require("express");
const router = express.Router();
const companyController = require("../controllers/company.controller");
const authenticate = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middleware");

router.get("/", companyController.getAllCompanies);
router.get("/:id", companyController.getCompanyById);

// Admin-only routes
router.post("/", authenticate, authorize("admin"), companyController.createCompany);
router.put("/:id", authenticate, authorize("admin"), companyController.updateCompany);
router.delete("/:id", authenticate, authorize("admin"), companyController.deleteCompany);

module.exports = router;
