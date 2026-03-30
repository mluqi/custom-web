const { Partner } = require("../models");
const fs = require("fs");
const path = require("path");

const deleteImageFile = (filePath) => {
  if (filePath && fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

const partnerController = {
  // Get all active partners (Public)
  getAllPartners: async (req, res) => {
    try {
      const { show_all } = req.query;
      const whereClause = {};

      if (show_all !== "true") {
        whereClause.is_active = true;
      }

      const partners = await Partner.findAll({
        where: whereClause,
        order: [["createdAt", "DESC"]],
      });
      res.status(200).json(partners);
    } catch (error) {
      console.error("Error fetching partners:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  // Create new partner (Admin)
  createPartner: async (req, res) => {
    try {
      const { name } = req.body;
      const logo = req.file ? req.file.filename : null;

      if (!logo) {
        return res.status(400).json({ message: "Logo image is required" });
      }

      const newPartner = await Partner.create({
        name,
        logo,
        is_active: true,
      });

      res.status(201).json(newPartner);
    } catch (error) {
      console.error("Error creating partner:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  // Update partner (Admin)
  updatePartner: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, is_active } = req.body;
      const partner = await Partner.findByPk(id);

      if (!partner) {
        return res.status(404).json({ message: "Partner not found" });
      }

      if (req.file) {
        // Delete old logo if exists
        if (partner.logo) {
          deleteImageFile(path.join(__dirname, "..", "uploads", partner.logo));
        }
        partner.logo = req.file.filename;
      }

      if (name) partner.name = name;
      if (is_active !== undefined) {
        partner.is_active = is_active === "true" || is_active === true;
      }

      await partner.save();
      res.status(200).json(partner);
    } catch (error) {
      console.error("Error updating partner:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  // Delete partner (Admin)
  deletePartner: async (req, res) => {
    try {
      const { id } = req.params;
      const partner = await Partner.findByPk(id);

      if (!partner) {
        return res.status(404).json({ message: "Partner not found" });
      }

      // Delete logo file
      if (partner.logo) {
        deleteImageFile(path.join(__dirname, "..", "uploads", partner.logo));
      }

      await partner.destroy();
      res.status(200).json({ message: "Partner deleted successfully" });
    } catch (error) {
      console.error("Error deleting partner:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
};

module.exports = partnerController;
