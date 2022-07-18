const {
  registerService,
  keepLoginService,
  verificationService,
  loginService,
  changePasswordService,
  profilePictureService,
  forgotPasswordService,
} = require("./authServices");
const {
  adminLoginService,
  newProductService,
  filterProductsService,
  getOrdersService,
  validPrescriptionService,
  getProductsService,
  getProductDetailsService,
  editProductService,
} = require("./adminServices");
const {
  fetchProductsService,
  fetchProductDetailsService,
  fetchPromoProductsService,
  filterProductService,
  deleteProductService,
} = require("./productServices");
const {
  fetchProvincesService,
  fetchCitiesService,
  fetchCostService,
} = require("./rajaOngkirServices");
const {
  addNewAddressService,
  changePrimaryAddressService,
} = require("./profileService");
const {
  getPrimaryAddressService,
  getAllAddressesService,
  rejectOrderService,
  confirmOrderService,
  uploadReceipeService,
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
  fetchProvincesService,
  fetchCitiesService,
  addNewAddressService,
  getPrimaryAddressService,
  getAllAddressesService,
  changePrimaryAddressService,
  rejectOrderService,
  confirmOrderService,
  fetchCostService,
  uploadReceipeService,
  filterProductsService,
  getOrdersService,
  validPrescriptionService,
  getProductsService,
<<<<<<< HEAD
  deleteProductService,
=======
  getProductDetailsService,
  editProductService,
>>>>>>> dcbcd8baa3aab29aa1c71ce56223339de6ba9a90
};
