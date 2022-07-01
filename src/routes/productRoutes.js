const express = require("express");
const {
  fetchProductsController,
  fetchProductDetailsController,
  filterProductController,
} = require("../controllers");
const Router = express.Router();

Router.get("/products/:category", fetchProductsController);
Router.get("/product-details/:id", fetchProductDetailsController);
Router.get("/product-name-category", filterProductController);

module.exports = Router;
