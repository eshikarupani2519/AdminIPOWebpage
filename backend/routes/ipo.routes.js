const express = require("express");
const router = express.Router();
const ipoController = require("../controllers/ipo.controller");
const authenticate = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middleware");
const upload = require("../middleware/upload.middleware");




router.post(
  "/",
  upload.fields([
    { name: 'rhp', maxCount: 1 },
    { name: 'drhp', maxCount: 1 }
  ]),
  ipoController.registerIPO
);

// Get all IPOs
router.get("/", ipoController.getAllIPOs);
router.get("/:id", ipoController.getIPOById);

// Search IPOs
router.get("/search", ipoController.searchIPOs);

// Get newly listed IPOs
router.get("/listed", ipoController.getNewListedIPOs);

// Update IPO
// router.put("/:id", authenticate, authorize("admin"), ipoController.updateIPO);
router.put(
  '/:id',
  authenticate,
  authorize('admin'),
  upload.fields([
    { name: 'rhp', maxCount: 1 },
    { name: 'drhp', maxCount: 1 }
  ]),
  ipoController.updateIPO
);


// Delete IPO
router.delete("/:id", authenticate, authorize("admin"), ipoController.deleteIPO);

// File Uploads
router.post(
  "/:id/upload",
  authenticate,
  authorize("admin"),
  upload.single("file"),
  ipoController.uploadDocument
);
router.get("/:id/download", ipoController.downloadDocument);
router.delete(
  "/:id/delete-doc",
  authenticate,
  authorize("admin"),
  ipoController.deleteDocument
);


module.exports = router;
