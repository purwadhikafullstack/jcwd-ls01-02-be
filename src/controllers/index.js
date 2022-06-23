const {
  registerController,
  keepLoginController,
  emailVerificationController,
  verificationController,
  loginController,
  forgotPassword,
  tokenPassword,
  changePassword,
} = require("./authController");
const { newProduct } = require("./productController");
module.exports = {
  newProduct,
  registerController,
  keepLoginController,
  emailVerificationController,
  verificationController,
  loginController,
  forgotPassword,
  tokenPassword,
  changePassword,
};
