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
  deleteProductService,
  getReportService,
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
  getReportService,
};
