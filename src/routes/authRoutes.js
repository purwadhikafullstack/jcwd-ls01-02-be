const express = require("express");
const { registerController } = require("../controllers");
const Router = express.Router();

Router.post("/register", registerController);

module.exports = Router;
