const express = require("express");
const {
  getPrimaryAddressController,
  getAllAddressesController,
} = require("../controllers");
const { verifyToken } = require("../lib");

const Router = express.Router();

Router.get("/primary-address", verifyToken, getPrimaryAddressController);
Router.get("/all-addresses", verifyToken, getAllAddressesController);

module.exports = Router;
