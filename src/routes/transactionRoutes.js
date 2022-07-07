const express = require("express");
const { uploadReceipe } = require("../controllers");
const { verifyToken, upload } = require("../lib");
const Router = express.Router();

const uploader = upload("/prescription-photo", "RECEIPE").fields([
  { name: "prescription_photo", maxCount: 1 },
]);

Router.post("/prescription-photo", verifyToken, uploader, uploadReceipe);

module.exports = Router;
