const express = require("express");
const {
  fetchProductsController,
  fetchProductDetailsController,
} = require("../controllers");
const Router = express.Router();

Router.get("/products/:category", fetchProductsController);
Router.get("/product-details/:product_name", fetchProductDetailsController);

module.exports = Router;
