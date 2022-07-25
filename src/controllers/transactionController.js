const { dbCon } = require("../connection");
const fs = require("fs");
const {
  addToCartServices,
  getCartServices,
  editQuantityonCartServices,
  deleteProductCartServices,
  getPrimaryAddressService,
  getAllAddressesService,
  rejectOrderService,
  confirmOrderService,
  uploadReceipeService,
} = require("../services/transactionServices");

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

const rejectOrderController = async (req, res) => {
  try {
    console.log("ini ya");
    console.log(req.query.id);
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
    const data = await confirmOrderService(req);
    return res.status(200).send({
      success: true,
      message: "Transaksi Diterima",
      data,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ success: false, message: error.message });
  }
};

module.exports = {
  uploadReceipeController,
  rejectOrderController,
  confirmOrderController,
  addToCartController,
  getCartController,
  editQuantityonCartController,
  deleteProductCartController,
};
