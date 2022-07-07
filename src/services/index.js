const {
  registerService,
  keepLoginService,
  verificationService,
  loginService,
  changePasswordService,
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
<<<<<<< HEAD
  addToCartService,
  getCartServices,
  editQuantityonCartServices,
  deleteProductCartServices,
=======
  fetchProvincesService,
  fetchCitiesService,
} = require("./rajaOngkirServices");
const {
  addNewAddressService,
  changePrimaryAddressService,
} = require("./profileService");
const {
  getPrimaryAddressService,
  getAllAddressesService,
>>>>>>> d047b68b97027b421d216b9e15604cbccd3980e1
} = require("./transactionServices");

module.exports = {
  registerService,
  keepLoginService,
  verificationService,
  adminLoginService,
  loginService,
  changePasswordService,
  profilePictureService,
  fetchProductsService,
  fetchProductDetailsService,
  filterProductService,
  forgotPasswordService,
  newProductService,
  fetchPromoProductsService,
<<<<<<< HEAD
  addToCartService,
  getCartServices,
  editQuantityonCartServices,
  deleteProductCartServices,
=======
  fetchProvincesService,
  fetchCitiesService,
  addNewAddressService,
  getPrimaryAddressService,
  getAllAddressesService,
  changePrimaryAddressService,
>>>>>>> d047b68b97027b421d216b9e15604cbccd3980e1
};
