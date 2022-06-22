const {
  registerController,
  keepLoginController,
  emailVerificationController,
  verificationController,
  loginController,
} = require("./authController");
const { newProduct } = require("./productController");

module.exports = {
  newProduct,
  registerController,
  keepLoginController,
  emailVerificationController,
  verificationController,
  loginController,
};
