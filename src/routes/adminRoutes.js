const express = require("express");
const {
  loginAdminController,
  newProduct,
  filterProductsController,
} = require("../controllers");
const Router = express.Router();

Router.post("/adminlogin", loginAdminController);
Router.post("/new-product", newProduct);
Router.get("/filter-products", filterProductsController);

module.exports = Router;
