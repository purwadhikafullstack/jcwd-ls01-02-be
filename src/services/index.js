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
<<<<<<< HEAD
  deleteProductService,
  getReportService,
=======
  getNameService,
  addStockService,
>>>>>>> 3bd99f63a730da0dcd3e7df6beec86b2b1b4d431
} = require("./adminServices");
const {
  fetchProductsService,
  fetchProductDetailsService,
  fetchPromoProductsService,
  filterProductService,
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
  deleteProductService,
  getProductDetailsService,
  editProductService,
<<<<<<< HEAD
  getReportService,
=======
  getNameService,
  addStockService,
>>>>>>> 3bd99f63a730da0dcd3e7df6beec86b2b1b4d431
};
