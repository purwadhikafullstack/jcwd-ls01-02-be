const express = require("express");
const {
  fetchProductsController,
  fetchProductDetailsController,
<<<<<<< HEAD
  fetchPromoProductsController,
=======
  filterProductController,
>>>>>>> 4a43629bc6e17585b1d9a64375ab0917ca777839
} = require("../controllers");

const Router = express.Router();

Router.get("/products/:category", fetchProductsController);
Router.get("/product-details/:id", fetchProductDetailsController);
Router.get("/product-name-category", filterProductController);
Router.get("/product-details/:product_name", fetchProductDetailsController);
Router.get("/promo-products", fetchPromoProductsController);

module.exports = Router;
