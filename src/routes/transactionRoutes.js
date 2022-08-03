const express = require("express");
const {
  addToCartController,
  getCartController,
  editQuantityonCartController,
  deleteProductCartController,
  getPrimaryAddressController,
  getAllAddressesController,
  getUserOrdersController,
  uploadReceipeController,
  rejectOrderController,
  confirmOrderController,
  getCartPrescriptionController,
  uploadPaymentProofController,
  paymentMethodController,
  getOrderDetailsController,
  orderReceivedController,
} = require("../controllers");

const { verifyToken } = require("../lib");
const Router = express.Router();
const multer = require("multer");
const storage = multer.memoryStorage();
const uploads = multer({ storage });

Router.post("/addtocart", verifyToken, addToCartController);
Router.get("/getcart", verifyToken, getCartController);
Router.patch("/editquantity", verifyToken, editQuantityonCartController);
Router.delete("/deleteproduct", verifyToken, deleteProductCartController);
Router.post(
  "/upload-resep",
  uploads.single("prescription_photo"),
  verifyToken,
  uploadReceipeController
);
Router.get("/primary-address", verifyToken, getPrimaryAddressController);
Router.get("/all-addresses", verifyToken, getAllAddressesController);
Router.get("/order-details", verifyToken, getOrderDetailsController);
Router.patch("/order/reject", rejectOrderController);
Router.patch("/order/confirm", confirmOrderController);
Router.get("/orders/:status", verifyToken, getUserOrdersController);
Router.get(
  "/get-cart-prescription",
  verifyToken,
  getCartPrescriptionController
);
Router.patch(
  "/upload-payment",
  uploads.single("payment_photo"),
  verifyToken,
  uploadPaymentProofController
);
Router.patch("/payment-method", paymentMethodController);
Router.patch("/order-received", orderReceivedController);

module.exports = Router;
