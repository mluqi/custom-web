const { DynamicService } = require("../models");
const fs = require("fs");
const path = require("path");

const deleteFile = (filename) => {
  if (!filename) return;
  const filePath = path.join(__dirname, "../uploads", filename);
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
};

exports.getAllServices = async (req, res) => {
  try {
    const services = await DynamicService.findAll();
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: "Error fetching services" });
  }
};

exports.getServiceBySlug = async (req, res) => {
  try {
    const service = await DynamicService.findOne({
      where: { slug: req.params.slug },
    });
    if (!service) return res.status(404).json({ message: "Service not found" });
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: "Error fetching service" });
  }
};

exports.createService = async (req, res) => {
  try {
    const data = req.body;
    if (req.files) {
      if (req.files.image) data.image = req.files.image[0].filename;
      if (req.files.secondary_image)
        data.secondary_image = req.files.secondary_image[0].filename;
    }

    // Parse JSON fields if sent as string
    [
      "title",
      "subtitle",
      "description",
      "features",
      "content",
      "cta_text",
      "seo_title",
      "seo_description",
    ].forEach((field) => {
      if (typeof data[field] === "string") {
        try {
          data[field] = JSON.parse(data[field]);
        } catch (e) {}
      }
    });

    const service = await DynamicService.create(data);
    res.status(201).json(service);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating service" });
  }
};

exports.updateService = async (req, res) => {
  try {
    const service = await DynamicService.findByPk(req.params.id);
    if (!service) return res.status(404).json({ message: "Service not found" });

    const data = req.body;
    if (req.files) {
      if (req.files.image) {
        deleteFile(service.image);
        data.image = req.files.image[0].filename;
      }
      if (req.files.secondary_image) {
        deleteFile(service.secondary_image);
        data.secondary_image = req.files.secondary_image[0].filename;
      }
    }

    // Parse JSON fields
    [
      "title",
      "subtitle",
      "description",
      "features",
      "content",
      "cta_text",
      "seo_title",
      "seo_description",
    ].forEach((field) => {
      if (typeof data[field] === "string") {
        try {
          data[field] = JSON.parse(data[field]);
        } catch (e) {}
      }
    });

    await service.update(data);
    res.json(service);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating service" });
  }
};

exports.deleteService = async (req, res) => {
  try {
    const service = await DynamicService.findByPk(req.params.id);
    if (!service) return res.status(404).json({ message: "Service not found" });

    deleteFile(service.image);
    deleteFile(service.secondary_image);
    await service.destroy();
    res.json({ message: "Service deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting service" });
  }
};
