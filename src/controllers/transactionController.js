const { dbCon } = require("../connection");
const fs = require("fs");
const {
  rejectOrderService,
  getUserOrdersService,
  addToCartServices,
  getCartServices,
  editQuantityonCartServices,
  deleteProductCartServices,
  confirmOrderService,
  uploadReceipeService,
  getCartPrescriptionService,
  uploadPaymentProofService,
  paymentMethodService,
  getOrderDetailsService,
  orderReceivedService,
} = require("../services");

const addToCartController = async (req, res) => {
  try {
    const data = await addToCartServices(req);
    return res.send({
      status: 200,
      success: true,
      message: "Product berhasil ditambahkan di Keranjang",
      data,
    });
  } catch (error) {
    // console.log(error);
    return res.status(500).send({ message: error.message || error });
  }
};

const getCartController = async (req, res) => {
  try {
    const data = await getCartServices(req);
    return res.send({
      status: 200,
      success: true,
      message: "Berhasil Mendapatkan cart",
      data,
    });
  } catch (error) {
    return res.status(500).send({ message: error.message || error });
  }
};

const editQuantityonCartController = async (req, res) => {
  try {
    const data = await editQuantityonCartServices(req);
    return res.send({
      status: 200,
      success: true,
      message: "Berhasil untuk Mengubah quantity",
      data,
    });
  } catch (error) {
    return res.status(500).send({ message: error.message || error });
  }
};

const deleteProductCartController = async (req, res) => {
  try {
    console.log(req.user, "QUERRYYYY");
    const data = await deleteProductCartServices(
      req.query.productId,
      req.user.id
    );
    return res.send({
      status: 200,
      success: true,
      message: "Berhasil untuk Menghapus Product didalam Cart",
      data,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({ message: error.message || error });
  }
};

const uploadReceipeController = async (req, res) => {
  try {
    await uploadReceipeService(req);
    return res.status(200).send("success");
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ success: false, message: error.message || error });
  }
};

const getPrimaryAddressController = async (req, res) => {
  try {
    const data = await getPrimaryAddressService(req);
    console.log(data);
    return res.status(200).send({
      success: true,
      message: "Primary Address",
      data,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ success: false, message: error.message });
  }
};

const getAllAddressesController = async (req, res) => {
  try {
    const data = await getAllAddressesService(req);
    return res.status(200).send({
      success: true,
      message: "All Addresses",
      data,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ success: false, message: error.message });
  }
};

const rejectOrderController = async (req, res) => {
  try {
    const data = await rejectOrderService(req);
    return res.status(200).send({
      success: true,
      message: "Transaksi Dibatalkan",
      data,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ success: false, message: error.message });
  }
};

const confirmOrderController = async (req, res) => {
  try {
    await confirmOrderService(req);
    return res.status(200).send({
      success: true,
      message: "Transaksi Diterima",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ success: false, message: error.message });
  }
};

const getUserOrdersController = async (req, res) => {
  try {
    const data = await getUserOrdersService(req);
    console.log(data);
    return res.status(200).send({
      success: true,
      message: "Order user berhasil",
      data,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ success: false, message: error.message || error });
  }
};

const getCartPrescriptionController = async (req, res) => {
  try {
    const data = await getCartPrescriptionService(req);
    console.log(data);
    return res.status(200).send({
      success: true,
      message: "Data Cart dari order resep",
      data,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ success: false, message: error.message || error });
  }
};

const uploadPaymentProofController = async (req, res) => {
  try {
    await uploadPaymentProofService(req);
    return res.status(200).send("Success to upload payment proof");
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ success: false, message: error.message || error });
  }
};

const paymentMethodController = async (req, res) => {
  try {
    await paymentMethodService(req);
    return res.status(200).send({
      success: true,
      message: "Success!",
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ success: false, message: error.message || error });
  }
};

const getOrderDetailsController = async (req, res) => {
  try {
    const data = await getOrderDetailsService(req);
    return res.status(200).send({
      success: true,
      message: "Data detail order",
      data,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ success: false, message: error.message || error });
  }
};

const orderReceivedController = async (req, res) => {
  try {
    await orderReceivedService(req);
    return res.status(200).send({
      success: true,
      message: "Data detail order",
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ success: false, message: error.message || error });
  }
};

module.exports = {
  uploadReceipeController,
  rejectOrderController,
  confirmOrderController,
  getUserOrdersController,
  addToCartController,
  getCartController,
  editQuantityonCartController,
  deleteProductCartController,
  getCartPrescriptionController,
  uploadPaymentProofController,
  paymentMethodController,
  getOrderDetailsController,
  orderReceivedController,
};
