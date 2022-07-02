const express = require("express");
const {
  fetchProductsController,
  fetchProductDetailsController,
  filterProductController,
} = require("../controllers");
const {
  pinjemDataGrup1Controller,
} = require("../controllers/productController");
const Router = express.Router();

Router.get("/products/:category", fetchProductsController);
Router.get("/product-details/:id", fetchProductDetailsController);
Router.get("/product-name-category", filterProductController);
Router.get("/product-details/:product_name", fetchProductDetailsController);

module.exports = Router;
