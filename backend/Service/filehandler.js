const multer = require("multer");
const fs = require("fs");
const path = require("path");

// Ensure directory exists
const ensureDir = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true }); // this will create nested dirs
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadDir;
    if (file.mimetype.startsWith("image/")) {
      uploadDir = path.join(path.resolve(__dirname , ".."), "/uploads/images");
    } else if (file.mimetype.startsWith("video/")) {
      uploadDir = path.join(path.resolve(__dirname , ".."), "/uploads/videos");
    } else {
      return cb(new Error("Unsupported file type"), null);
    }

    uploadDir.replace("/Service" , "")
    ensureDir(uploadDir);
    cb(null, uploadDir); // CORRECT: error first, then path
  },

  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const uploads = multer({ storage });

module.exports = uploads;
