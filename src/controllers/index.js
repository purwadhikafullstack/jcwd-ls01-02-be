const { registerController } = require("./authController");
const { newProduct } = require("./productController");

module.exports = {
  newProduct,
  registerController,
};
