const express = require("express");
const {
  addToCartController,
  getCartController,
  editQuantityonCartController,
  deleteProductCartController,
} = require("../controllers");
const Router = express.Router();
const { verifyToken } = require("../lib");

Router.post("/addtocart", verifyToken, addToCartController);
Router.get("/getcart", verifyToken, getCartController);
Router.patch("/editquantity", verifyToken, editQuantityonCartController);
Router.patch("/deleteproduct", verifyToken, deleteProductCartController);

module.exports = Router;
