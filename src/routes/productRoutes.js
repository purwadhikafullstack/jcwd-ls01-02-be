const express = require("express");
const {
  fetchProductsController,
  fetchProductDetailsController,
  fetchPromoProductsController,
  filterProductController,
} = require("../controllers");

const Router = express.Router();

Router.get("/products/:category", fetchProductsController);
Router.get("/product-name-category", filterProductController);
Router.get("/product-details/:product_name", fetchProductDetailsController);
Router.get("/promo-products", fetchPromoProductsController);

module.exports = Router;
