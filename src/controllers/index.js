const {
  registerController,
  keepLoginController,
  emailVerificationController,
  verificationController,
  loginController,
  forgotPasswordController,
  tokenPasswordController,
  changePassword,
  profilePictureController,
  resetPasswordController,
} = require("./authController");
const { loginAdminController, newProduct } = require("./adminController");
const {
  fetchProductsController,
  fetchProductDetailsController,
  fetchPromoProductsController,
  filterProductController,
} = require("./productController");
const {
  updateProfile,
  getUserDetails,
  addNewAddressController,
} = require("./profileControllers");
const {
  fetchProvincesController,
  fetchCitiesController,
} = require("./rajaOngkirController");
const {
  getPrimaryAddressController,
  getAllAddressesController,
} = require("./transactionController");

module.exports = {
  newProduct,
  registerController,
  keepLoginController,
  emailVerificationController,
  verificationController,
  loginAdminController,
  loginController,
  forgotPasswordController,
  tokenPasswordController,
  changePassword,
  fetchProductsController,
  fetchProductDetailsController,
  profilePictureController,
  filterProductController,
  resetPasswordController,
  fetchPromoProductsController,
  updateProfile,
  getUserDetails,
  fetchProvincesController,
  fetchCitiesController,
  addNewAddressController,
  getPrimaryAddressController,
  getAllAddressesController,
};
