const multer = require("multer");
const fs = require("fs");
const sharp = require("sharp");

const upload = (destination, fileNamePrefix) => {
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

const paymentPhoto = (destination, fileNamePrefix) => {
  console.log(`Proses upload`);
  const defaultPath = "./public";
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const dirAva = "/payment-photo";
      let directory;
      if (file.fieldname === "payment_photo") {
        directory = defaultPath + destination + dirAva;
      } else {
        directory = defaultPath + destination;
      }
      fs.existsSync(directory)
        ? cb(null, directory)
        : fs.mkdir(directory, { recursive: true }, (error) =>
            cb(error, directory)
          );
    },
    filename: function (req, file, cb) {
      let originalName = file.originalname;
      const fileAva = "AVATAR";

      let extention = originalName.split(".");
      let fileName;
      if (file.fieldname === "payment_photo") {
        fileName = `${fileNamePrefix}${fileAva}${
          Date.now() + Math.round(Math.random() * 500000)
        }.${extention[extention.length - 1]}`;
      } else {
        fileName = `${fileNamePrefix}${Date.now()}.${
          extention[extention.length - 1]
        }`;
      }
      cb(null, fileName);
    },
  });

  const fileFilter = function (req, file, cb) {
    const ext = /\.(jpg|jpeg|png|gif|JPEG|JPG)$/;
    console.log("file:", file);
    if (!file.originalname.match(ext)) {
      return cb(new Error("Only listed file types are allowed"), false);
    }
    cb(null, true);
  };

  return multer({
    storage,
    fileFilter,
  });
};

module.exports = { upload, paymentPhoto };
const imageProcess = async (file, path) => {
  try {
    let type = path.split("/");
    if (type[2] === "products") {
      await sharp(file.buffer).resize({ width: 500, height: 500 }).toFile(path);
    } else {
      await sharp(file.buffer).toFile(path);
    }
  } catch (error) {
    throw { message: "Gagal menyimpan foto" };
  }
};
module.exports = { upload, imageProcess };
