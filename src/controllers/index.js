const {
  registerController,
  keepLoginController,
  emailVerificationController,
  verificationController,
  loginController,
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
  changePasswordProfileController,
};
