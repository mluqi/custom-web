const express = require("express");
const router = express.Router();
const controller = require("../controllers/internetPageController");
const authMiddleware = require("../middlewares/authMiddleware");
const upload = require("../middlewares/fileMiddleware");

router.get("/", controller.getAllContents);
router.put("/:id", authMiddleware, upload.any(), controller.updateContent);

module.exports = router;
