const express = require("express");
const {
  fetchProvincesController,
  fetchCitiesController,
  fetchCostController,
} = require("../controllers");

const Router = express.Router();

Router.get("/provinces", fetchProvincesController);
Router.get("/cities", fetchCitiesController);
Router.post("/cost", fetchCostController);

module.exports = Router;
