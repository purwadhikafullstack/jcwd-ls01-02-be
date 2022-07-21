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

// module.exports = { upload };
// const multer = require("multer");
// var fs = require("fs");

// module.exports = {
//   upload(destination, fileNamePrefix) {
//     const storage = multer.diskStorage({
//       destination: (req, file, cb) => {
//         const dir = destination;
//         if (fs.existsSync(dir)) {
//           console.log(dir, "exists");
//           cb(null, dir);
//         } else {
//           fs.mkdir(dir, { recursive: true }, (err) => cb(err, dir));
//           console.log(dir, "make");
//         }
//       },
//       filename: (req, file, cb) => {
//         let originalname = file.originalname;
//         let ext = originalname.split(".");
//         let filename = fileNamePrefix + Date.now() + "." + ext[ext.length - 1];
//         cb(null, filename);
//       },
//     });

//     const imageFilter = (req, file, callback) => {
//       const ext = /\.(jpg|jpeg|png|JPEG|JPG|webp)$/;
//       if (!file.originalname.match(ext)) {
//         return callback(
//           new Error("Only selected file type are allowed"),
//           false
//         );
//       }
//       callback(null, true);
//     };

//     return multer({
//       storage,
//       fileFilter: imageFilter,
//     });
//   },
// };
const imageProcess = async (file, path) => {
  try {
    await sharp(file.buffer).resize({ width: 500, height: 500 }).toFile(path);
  } catch (error) {
    throw { message: "Gagal menyimpan foto" };
  }
};
module.exports = { upload, imageProcess };
