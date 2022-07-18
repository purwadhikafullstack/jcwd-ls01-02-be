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
const {
  loginAdminController,
  filterProductsController,
  getOrdersController,
  validPrescriptionController,
  getProductsController,
  newProductController,
  getProductDetailsController,
  editProductController,
} = require("./adminController");
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
  changePrimaryAddressController,
} = require("./profileControllers");
const {
  fetchProvincesController,
  fetchCitiesController,
  fetchCostController,
} = require("./rajaOngkirController");
const {
  getPrimaryAddressController,
  getAllAddressesController,
} = require("./transactionController");

module.exports = {
  newProductController,
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
  changePrimaryAddressController,
  fetchCostController,
  filterProductsController,
  getOrdersController,
  validPrescriptionController,
  getProductsController,
  getProductDetailsController,
  editProductController,
};
