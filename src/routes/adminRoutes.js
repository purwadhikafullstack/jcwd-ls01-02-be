const express = require("express");
const { loginAdminController } = require("../controllers");
const Router = express.Router();

Router.post("/adminlogin", loginAdminController);

module.exports = Router;
