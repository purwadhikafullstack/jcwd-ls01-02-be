const express = require("express");
const {
  uploadReceipe,
  getPrimaryAddressController,
  getAllAddressesController,
} = require("../controllers");
const { verifyToken, upload } = require("../lib");
const Router = express.Router();
const uploader = upload("/prescription-photo", "RECEIPE").fields([
  { name: "prescription_photo", maxCount: 1 },
]);

Router.post("/prescription-photo", verifyToken, uploader, uploadReceipe);

Router.get("/primary-address", verifyToken, getPrimaryAddressController);
Router.get("/all-addresses", verifyToken, getAllAddressesController);

module.exports = Router;
