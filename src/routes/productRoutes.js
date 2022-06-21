const express = require("express");
const { newProduct } = require("../controllers");
const Router = express.Router();

Router.post("/newproduct", newProduct);
module.exports = Router;
