const multer = require("multer");
const fs = require("fs");

const upload = (destination, fileNamePrefix) => {
  console.log(`Proses upload`);
  const defaultPath = "./public";
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const dir = defaultPath + destination;
      if (fs.existsSync(dir)) {
        console.log(dir, "exist ya");
        cb(null, dir);
      } else {
        fs.mkdir(dir, { recursive: true }, (err) => cb(err, dir));
        console.log(dir, "create");
      }
    },
    filename: function (req, file, cb) {
      let originalName = file.originalname;
      let ext = originalName.split(".");
      let filename = fileNamePrefix + Date.now() + "." + ext[ext.length - 1];
      cb(null, filename);
    },
  });

  const fileFilter = function (req, file, cb) {
    const ext = /\.(jpg|jpeg|png|gif|JPEG|JPG)$/;
    console.log("file:", file);
    if (!file.originalname.match(ext)) {
      return cb(
        new Error("Tipe ekstensi file yang anda masukkan tidak didukung!"),
        false
      );
    }
    cb(null, true);
  };

  return multer({
    storage,
    fileFilter,
    limits: {
      fileSize: 10 * 1024 * 1024,
    },
  });
};

module.exports = { upload };
