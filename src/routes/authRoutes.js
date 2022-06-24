const express = require("express");
const {
  registerController,
  keepLoginController,
  emailVerificationController,
  verificationController,
  loginController,
  changePasswordProfileController,
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
Router.post("/login", loginController);
Router.post(
  "/changepasswordprofile",
  verifyToken,
  changePasswordProfileController
);

module.exports = Router;
