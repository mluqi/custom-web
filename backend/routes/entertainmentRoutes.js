const express = require("express");
const router = express.Router();
const controller = require("../controllers/entertainmentController");
const authMiddleware = require("../middlewares/authMiddleware");
const upload = require("../middlewares/fileMiddleware");

router.get("/", controller.getAll);
router.post("/", authMiddleware, upload.single("image"), controller.create);
router.put("/:id", authMiddleware, upload.single("image"), controller.update);
router.delete("/:id", authMiddleware, controller.delete);

module.exports = router;
