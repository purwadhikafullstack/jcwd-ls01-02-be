const {
  registerController,
  keepLoginController,
  emailVerificationController,
  verificationController,
  loginController,
  forgotPassword,
  tokenPassword,
  changePassword,
  changePasswordProfileController,
} = require("./authController");
const { loginAdminController } = require("./adminController");
const { newProduct } = require("./productController");

module.exports = {
  newProduct,
  registerController,
  keepLoginController,
  emailVerificationController,
  verificationController,
  loginAdminController,
  loginController,
  forgotPassword,
  tokenPassword,
  changePassword,
  changePasswordProfileController,
};
