const express = require("express");
const {
  registerController,
  keepLoginController,
  emailVerificationController,
  verificationController,
  loginController,
  forgotPasswordController,
  tokenPasswordController,
  changePassword,
  changePasswordProfileController,
  profilePictureController,
  resetPasswordController,
} = require("../controllers");
const { verifyToken, verifyLastToken } = require("../lib");
const Router = express.Router();

// Registration endpoint
Router.post("/register", registerController);
// Sending Email Verification endpoint
Router.post("/email-verification", emailVerificationController);
// Keep Login endpoint
Router.get("/keep-login", verifyToken, keepLoginController);
// Account Verification Process endpoint
Router.get(
  "/verification",
  verifyToken,
  verifyLastToken,
  verificationController
);
// Login endpoint
Router.post("/login", loginController);
// Sending Email Forgot Password endpoint
Router.post("/forgot-password", forgotPasswordController);
// Verifying Last Token Requested endpoint
Router.get(
  "/token-password",
  verifyToken,
  verifyLastToken,
  tokenPasswordController
);
// Reset Password endpoint
Router.post("/reset-password", verifyToken, resetPasswordController);
// Change password inside profile endpoint
Router.post("/change-password", verifyToken, changePassword);
Router.post("/profilepicture", profilePictureController);

module.exports = Router;
