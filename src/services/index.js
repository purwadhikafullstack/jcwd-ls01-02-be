const {
  registerService,
  keepLoginService,
  verificationService,
  loginService,
  changePasswordProfileService,
  profilePictureService,
  forgotPasswordService,
} = require("./authServices");
const { adminLoginService, newProductService } = require("./adminServices");
const {
  fetchProductsService,
  fetchProductDetailsService,
  fetchPromoProductsService,
  filterProductService,
} = require("./productServices");
const {
  addToCartService,
  getCartServices,
  editQuantityonCartServices,
  deleteProductCartServices,
} = require("./transactionServices");

module.exports = {
  registerService,
  keepLoginService,
  verificationService,
  adminLoginService,
  loginService,
  changePasswordProfileService,
  profilePictureService,
  fetchProductsService,
  fetchProductDetailsService,
  filterProductService,
  forgotPasswordService,
  newProductService,
  fetchPromoProductsService,
  addToCartService,
  getCartServices,
  editQuantityonCartServices,
  deleteProductCartServices,
};
