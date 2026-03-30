const { SiteSetting } = require("../models");
const fs = require("fs");
const path = require("path");

// Helper: Hapus file lama
const deleteFile = (filename) => {
  if (!filename) return;
  const filePath = path.join(__dirname, "../uploads", filename);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

exports.getSettings = async (req, res) => {
  try {
    // Mengambil semua setting, diurutkan agar tampilan di Admin konsisten
    const settings = await SiteSetting.findAll({
      order: [
        ["group", "ASC"],
        ["id", "ASC"],
      ],
    });
    res.json(settings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching settings" });
  }
};

exports.getPublicSettings = async (req, res) => {
  try {
    // Mengambil setting dan mengubahnya menjadi format object sederhana { key: value }
    // Ini memudahkan frontend untuk mengakses misal: settings.site_logo atau settings.accent_color
    const settings = await SiteSetting.findAll();
    const formatted = settings.reduce((acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {});
    res.json(formatted);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching public settings" });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    const textData = req.body; // Data text dari form
    const files = req.files; // Data file dari multer (array)

    // 1. Proses Update Text Data
    // Loop semua key yang dikirim di body
    const textUpdatePromises = Object.keys(textData).map(async (key) => {
      const setting = await SiteSetting.findOne({ where: { key } });
      if (setting) {
        // Jangan update jika tipe setting adalah image tapi data yang dikirim text (kecuali memang disengaja)
        // Ini mencegah overwrite tidak sengaja jika frontend mengirim key gambar sebagai text kosong
        if (setting.type !== "image" && setting.value !== textData[key]) {
          await setting.update({ value: textData[key] });
        }
      } else {
        // Opsional: Jika ingin fitur "Auto Create Setting" jika key belum ada
        // await SiteSetting.create({ key, value: textData[key], group: 'general', type: 'text' });
      }
    });

    // 2. Proses Update File (Gambar)
    // req.files adalah array object [{ fieldname: 'site_logo', filename: '...', ... }]
    let fileUpdatePromises = [];
    if (files && files.length > 0) {
      fileUpdatePromises = files.map(async (file) => {
        const key = file.fieldname; // fieldname di form harus sama dengan 'key' di database
        const setting = await SiteSetting.findOne({ where: { key } });

        if (setting) {
          // Hapus file lama jika ada dan bukan URL eksternal
          if (setting.value && !setting.value.startsWith("http")) {
            deleteFile(setting.value);
          }
          // Update dengan filename baru
          await setting.update({ value: file.filename });
        } else {
          // Jika key tidak ditemukan di DB tapi file terupload, hapus file agar tidak jadi sampah
          deleteFile(file.filename);
        }
      });
    }

    // Tunggu semua proses selesai
    await Promise.all([...textUpdatePromises, ...fileUpdatePromises]);

    // Kembalikan data terbaru
    const updatedSettings = await SiteSetting.findAll({
      order: [
        ["group", "ASC"],
        ["id", "ASC"],
      ],
    });
    res.json({
      message: "Settings updated successfully",
      data: updatedSettings,
    });
  } catch (error) {
    console.error("Error updating settings:", error);
    res.status(500).json({ message: "Error updating settings" });
  }
};
