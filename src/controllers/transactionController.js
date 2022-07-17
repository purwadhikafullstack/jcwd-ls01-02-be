const { dbCon } = require("../connection");
const fs = require("fs");

const uploadReceipeController = async (req, res) => {
  try {
    const data = await uploadReceipeService(req);
    return res.status(200).send({
      success: true,
      message: "upload success",
      data,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ success: false, message: error.message || error });
  }
};

// const uploadReceipeController = (req, res) => {
//   try {
//     const path = "Public/resep";
//     const upload = upload(path, "RESEP").fields([{ name: "image" }]);
//     const { id } = data.id;
//     upload(req, res, (error) => {
//       if (error) {
//         return res
//           .status(500)
//           .send({ message: "Uplous Resep failed !", error: error.message });
//       }
//       const { image } = req.files;
//       const imagePath = image ? path + "/" + image[0].filename : null;

//       var sql = `INSERT INTO orders (prescription_photo, User_id) VALUES ('${imagePath}', '${id}');`;
//       dbCon.query(sql, (error, results) => {
//         console.log("ini results", results);
//         console.log("ini err", error);
//         if (error) {
//           return res
//             .status(500)
//             .send({ message: "Server Error", error: error.message });
//         }

//         sql = `SELECT * from orders where User_id = ${id};`;
//         dbCon.query(sql, id, (error2, results2) => {
//           console.log("ini results2", results2);
//           if (error2) {
//             return res
//               .status(500)
//               .send({ message: "Server Error", error: error.message });
//           }

//           return res.status(200).send(results2);
//         });
//       });
//     });
//   } catch (error) {
//     return res
//       .status(500)
//       .json({ message: "Server Error", error: error.message });
//   }
// };

const {
  getPrimaryAddressService,
  getAllAddressesService,
  rejectOrderService,
  confirmOrderService,
  uploadReceipeService,
} = require("../services");

const getPrimaryAddressController = async (req, res) => {
  try {
    const data = await getPrimaryAddressService(req);
    console.log(data);
    return res.status(200).send({
      success: true,
      message: "Primary Address",
      data,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ success: false, message: error.message });
  }
};

const getAllAddressesController = async (req, res) => {
  try {
    const data = await getAllAddressesService(req);
    return res.status(200).send({
      success: true,
      message: "All Addresses",
      data,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ success: false, message: error.message });
  }
};

const rejectOrderController = async (req, res) => {
  try {
    const data = await rejectOrderService(req);
    return res.status(200).send({
      success: true,
      message: "Transaksi Dibatalkan",
      data,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ success: false, message: error.message });
  }
};

const confirmOrderController = async (req, res) => {
  try {
    const data = await confirmOrderService(req);
    return res.status(200).send({
      success: true,
      message: "Transaksi Dibatalkan",
      data,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ success: false, message: error.message });
  }
};

module.exports = {
  getPrimaryAddressController,
  getAllAddressesController,
  uploadReceipeController,
  rejectOrderController,
  confirmOrderController,
};
