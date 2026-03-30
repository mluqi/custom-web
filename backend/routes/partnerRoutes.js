const express = require("express");
const router = express.Router();
const partnerController = require("../controllers/partnerController");
const upload = require("../middlewares/fileMiddleware");

// Public: Get all partners
router.get("/", partnerController.getAllPartners);

// Admin: Create partner (with image upload)
router.post("/", upload.single("logo"), partnerController.createPartner);

// Admin: Update partner
router.put("/:id", upload.single("logo"), partnerController.updatePartner);

// Admin: Delete partner
router.delete("/:id", partnerController.deletePartner);

module.exports = router;
