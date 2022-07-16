const express = require("express");
const {
  loginAdminController,
  newProduct,
  filterProductsController,
  getOrdersController,
  validPrescriptionController,
  getProductsController,
} = require("../controllers");
const Router = express.Router();

Router.post("/adminlogin", loginAdminController);
Router.post("/new-product", newProduct);
Router.get("/filter-products", filterProductsController);
Router.get("/orders/:status", getOrdersController);
Router.post("/order/valid-prescription", validPrescriptionController);
Router.get("/products", getProductsController);

module.exports = Router;
