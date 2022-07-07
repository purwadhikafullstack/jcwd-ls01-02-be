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
} = require("./authController");
const { loginAdminController, newProduct } = require("./adminController");
const {
  fetchProductsController,
  fetchProductDetailsController,
  fetchPromoProductsController,
  filterProductController,
} = require("./productController");
const { updateProfile, getUserDetails } = require("./profileControllers");
const { uploadReceipe } = require("./transactionController");

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
  changePasswordProfileController,
  profilePictureController,
  filterProductController,
  resetPasswordController,
  fetchPromoProductsController,
  updateProfile,
  getUserDetails,
  uploadReceipe,
};
