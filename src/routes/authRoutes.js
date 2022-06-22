const express = require("express");
const {
  registerController,
  keepLoginController,
  emailVerificationController,
  verificationController,
} = require("../controllers");
const { verifyToken, verifyLastToken } = require("../lib");
const Router = express.Router();

Router.post("/register", registerController);
Router.post("/email-verification", emailVerificationController);
Router.get("/keep-login", verifyToken, keepLoginController);
Router.get(
  "/verification",
  verifyToken,
  verifyLastToken,
  verificationController
);

module.exports = Router;
