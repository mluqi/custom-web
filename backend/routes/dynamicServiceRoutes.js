const express = require("express");
const router = express.Router();
const controller = require("../controllers/dynamicServiceController");
const authMiddleware = require("../middlewares/authMiddleware");
const upload = require("../middlewares/fileMiddleware");

router.get("/", controller.getAllServices);
router.get("/:slug", controller.getServiceBySlug);
router.post("/", authMiddleware, upload.fields([{ name: 'image' }, { name: 'secondary_image' }]), controller.createService);
router.put("/:id", authMiddleware, upload.fields([{ name: 'image' }, { name: 'secondary_image' }]), controller.updateService);
router.delete("/:id", authMiddleware, controller.deleteService);

module.exports = router;
