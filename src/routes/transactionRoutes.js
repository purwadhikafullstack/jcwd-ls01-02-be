const express = require("express");
const {
  getPrimaryAddressController,
  getAllAddressesController,
} = require("../controllers");

const {
  uploadReceipeController,
} = require("../controllers/transactionController");

const { verifyToken, upload } = require("../lib");

const Router = express.Router();

const uploader = upload("/prescription-photo", "RECEIPE").single(
  "prescription_photo"
);
Router.post(
  "/prescription-photo",
  verifyToken,
  uploader,
  uploadReceipeController
);

Router.get("/primary-address", verifyToken, getPrimaryAddressController);
Router.get("/all-addresses", verifyToken, getAllAddressesController);

module.exports = Router;
