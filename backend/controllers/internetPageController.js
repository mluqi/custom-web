const { InternetPageContent } = require("../models");
const fs = require("fs");
const path = require("path");

const deleteFile = (filename) => {
  if (!filename) return;
  const filePath = path.join(__dirname, "../uploads", filename);
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
};

exports.getAllContents = async (req, res) => {
  try {
    const contents = await InternetPageContent.findAll();
    res.json(contents);
  } catch (error) {
    res.status(500).json({ message: "Error fetching content" });
  }
};

exports.updateContent = async (req, res) => {
  try {
    const { id } = req.params;
    const content = await InternetPageContent.findByPk(id);
    if (!content) return res.status(404).json({ message: "Content not found" });

    const data = req.body;
    let items = [];

    // Parse items jika dikirim sebagai string JSON
    if (typeof data.items === "string") {
      try {
        items = JSON.parse(data.items);
      } catch (e) {
        items = [];
      }
    } else {
      items = data.items || [];
    }

    // Handle Multiple Image Uploads
    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        if (file.fieldname === "image") {
          // Main image (Hero background etc)
          if (content.image && !content.image.startsWith("http"))
            deleteFile(content.image);
          data.image = file.filename;
        } else if (file.fieldname.startsWith("item_image_")) {
          // Item image (Service items)
          const index = parseInt(file.fieldname.split("_")[2]);
          if (items[index]) {
            if (items[index].image && !items[index].image.startsWith("http"))
              deleteFile(items[index].image);
            items[index].image = file.filename;
          }
        }
      });
    }

    // Update items kembali ke data
    data.items = items;

    // Parse JSON fields if they come as strings (from FormData)
    ["title", "subtitle", "description", "extra_data"].forEach((field) => {
      if (typeof data[field] === "string") {
        try {
          data[field] = JSON.parse(data[field]);
        } catch (e) {}
      }
    });

    await content.update(data);
    res.json(content);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating content" });
  }
};
