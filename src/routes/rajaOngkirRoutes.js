const express = require("express");
const {
  fetchProvincesController,
  fetchCitiesController,
} = require("../controllers");

const Router = express.Router();

Router.get("/provinces", fetchProvincesController);
Router.get("/cities", fetchCitiesController);

module.exports = Router;
