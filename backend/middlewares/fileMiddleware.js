const multer = require("multer");
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");

// Pastikan folder uploads ada
const uploadDir = "uploads/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase(),
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error("Only images are allowed (jpeg, jpg, png, gif, webp)!"));
  }
};

const multerUpload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

const processFile = async (file) => {
  const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
  const ext = path.extname(file.originalname).toLowerCase();
  const filename = file.fieldname + "-" + uniqueSuffix + ext;
  const filepath = path.join(uploadDir, filename);

  let pipeline = sharp(file.buffer);
  pipeline = pipeline.resize({ width: 1920, withoutEnlargement: true });

  if (ext === ".jpg" || ext === ".jpeg") {
    pipeline = pipeline.jpeg({ quality: 95, mozjpeg: true });
  } else if (ext === ".png") {
    pipeline = pipeline.png({ quality: 95, compressionLevel: 8 });
  } else if (ext === ".webp") {
    pipeline = pipeline.webp({ quality: 95 });
  }

  await pipeline.toFile(filepath);

  file.path = filepath;
  file.filename = filename;
  file.destination = uploadDir;
};

const upload = {
  ...multerUpload,
  single: (fieldName) => {
    return (req, res, next) => {
      multerUpload.single(fieldName)(req, res, async (err) => {
        if (err) return next(err);
        if (!req.file) return next();

        try {
          await processFile(req.file);
          next();
        } catch (error) {
          next(error);
        }
      });
    };
  },
  fields: (fieldsArray) => {
    return (req, res, next) => {
      multerUpload.fields(fieldsArray)(req, res, async (err) => {
        if (err) return next(err);
        if (!req.files) return next();

        try {
          const tasks = [];
          Object.values(req.files).forEach((files) => {
            files.forEach((file) => {
              tasks.push(processFile(file));
            });
          });
          await Promise.all(tasks);
          next();
        } catch (error) {
          next(error);
        }
      });
    };
  },
  any: () => {
    return (req, res, next) => {
      multerUpload.any()(req, res, async (err) => {
        if (err) return next(err);
        if (!req.files) return next();

        try {
          const tasks = req.files.map((file) => processFile(file));
          await Promise.all(tasks);
          next();
        } catch (error) {
          next(error);
        }
      });
    };
  },
};

module.exports = upload;
