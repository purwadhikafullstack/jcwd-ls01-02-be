const express = require("express");
const {
  fetchProductsController,
  fetchProductDetailsController,
  fetchPromoProductsController,
} = require("../controllers");

const Router = express.Router();

Router.get("/products/:category", fetchProductsController);
Router.get("/product-details/:product_name", fetchProductDetailsController);
Router.get("/promo-products", fetchPromoProductsController);

module.exports = Router;
