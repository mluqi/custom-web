const { Entertainment } = require("../models");
const fs = require("fs");
const path = require("path");

// Helper delete file
const deleteFile = (filename) => {
  if (!filename) return;
  const filePath = path.join(__dirname, "../uploads", filename);
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
};

exports.getAll = async (req, res) => {
  try {
    const data = await Entertainment.findAll({
      order: [["order", "ASC"]],
    });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { category, title, subtitle, description, url, meta, order, is_active } = req.body;
    const image = req.file ? req.file.filename : null;

    const newItem = await Entertainment.create({
      category,
      title,
      subtitle,
      description,
      url,
      meta,
      order,
      is_active,
      image
    });

    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Entertainment.findByPk(id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    const updateData = { ...req.body };
    if (req.file) {
      deleteFile(item.image);
      updateData.image = req.file.filename;
    }

    await item.update(updateData);
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Entertainment.findByPk(id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    deleteFile(item.image);
    await item.destroy();
    res.json({ message: "Item deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
