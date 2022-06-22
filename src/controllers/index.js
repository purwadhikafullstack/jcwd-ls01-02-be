const {
  registerController,
  keepLoginController,
  emailVerificationController,
  verificationController,
} = require("./authController");
const { newProduct } = require("./productController");
module.exports = {
  newProduct,
  registerController,
  keepLoginController,
  emailVerificationController,
  verificationController,
};
