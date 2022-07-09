const express = require("express");
const {
  addToCartController,
  getCartController,
  editQuantityonCartController,
  deleteProductCartController,
  getPrimaryAddressController,
  getAllAddressesController,
} = require("../controllers");
const Router = express.Router();
const { verifyToken } = require("../lib");

Router.post("/addtocart", verifyToken, addToCartController);
Router.get("/getcart", verifyToken, getCartController);
Router.patch("/editquantity", verifyToken, editQuantityonCartController);
Router.delete("/deleteproduct", verifyToken, deleteProductCartController);

Router.get("/primary-address", verifyToken, getPrimaryAddressController);
Router.get("/all-addresses", verifyToken, getAllAddressesController);

module.exports = Router;
