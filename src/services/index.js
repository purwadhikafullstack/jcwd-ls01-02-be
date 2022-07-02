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
  filterProductService,
} = require("./productServices");

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
};
