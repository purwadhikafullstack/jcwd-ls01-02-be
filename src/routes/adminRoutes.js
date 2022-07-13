const express = require("express");
const {
  loginAdminController,
  newProduct,
  filterProductsController,
  getOrdersController,
  validPrescriptionController,
} = require("../controllers");
const Router = express.Router();

Router.post("/adminlogin", loginAdminController);
Router.post("/new-product", newProduct);
Router.get("/filter-products", filterProductsController);
Router.get("/orders/:status", getOrdersController);
Router.get("/order/valid-prescription", validPrescriptionController);

module.exports = Router;
