const express = require("express");
const { dbCon } = require("../connection");
const {
  getPrimaryAddressController,
  getAllAddressesController,
  getUserOrdersController,
} = require("../controllers");
const multer = require("multer");
const { imageProcess } = require("../lib/upload");
const storage = multer.memoryStorage();
const uploads = multer({ storage });

const {
  uploadReceipeController,
  rejectOrderController,
  confirmOrderController,
} = require("../controllers/transactionController");

const { verifyToken, upload } = require("../lib");
const { dateGenerator, codeGenerator } = require("../lib/codeGenerator");
const Router = express.Router();

Router.post(
  "/upload-resep",
  uploads.single("prescription_photo"),
  verifyToken,
  uploadReceipeController
);

Router.get("/primary-address", verifyToken, getPrimaryAddressController);
Router.get("/all-addresses", verifyToken, getAllAddressesController);
Router.post("/order", async (req, res) => {
  try {
    let date = dateGenerator();
    let user_id = 60000;
    let transaction_code = codeGenerator("LANGSUNG", date, user_id);
    return res.status(200).send(transaction_code);
  } catch (error) {
    console.log(error);
    return res.status(500).send("failed");
  }
});
Router.patch("/order/reject", rejectOrderController);
Router.patch("/order/confirm", confirmOrderController);
Router.get("/orders/:status", getUserOrdersController);
module.exports = Router;
