const express = require("express");
const router = express.Router();
const {
  getSettings,
  getPublicSettings,
  updateSettings,
} = require("../controllers/siteSettingController");
const authMiddleware = require("../middlewares/authMiddleware");
const upload = require("../middlewares/fileMiddleware");

// Public route: Untuk frontend mengambil konfigurasi (warna, logo, sosmed)
router.get("/public", getPublicSettings);

// Admin route: Untuk mengambil semua detail setting (termasuk group, type)
router.get("/", authMiddleware, getSettings);

// Admin route: Untuk update (support multipart/form-data untuk upload gambar)
// upload.any() digunakan agar bisa menerima file dengan fieldname dinamis sesuai 'key' di DB
router.put("/", authMiddleware, upload.any(), updateSettings);

module.exports = router;
