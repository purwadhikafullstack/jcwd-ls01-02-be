const {
  registerService,
  keepLoginService,
  verificationService,
  loginService,
  changePasswordProfileService,
  profilePictureService,
} = require("./authServices");
const { adminLoginService } = require("./adminServices");
const {
  fetchProductsService,
  fetchProductDetailsService,
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
};
