const express = require("express");
const { loginAdminController, newProduct } = require("../controllers");
const Router = express.Router();

Router.post("/adminlogin", loginAdminController);
Router.post("/new-product", newProduct);

module.exports = Router;
