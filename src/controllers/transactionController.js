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

<<<<<<< HEAD
const {
  getPrimaryAddressService,
  getAllAddressesService,
  rejectOrderService,
  confirmOrderService,
  uploadReceipeService,
  getUserOrdersService,
} = require("../services");

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

=======
>>>>>>> 857df14ed78eca14f7717a33af4a20ea8badb0e4
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

module.exports = {
  uploadReceipeController,
  rejectOrderController,
  confirmOrderController,
<<<<<<< HEAD
  getUserOrdersController,
=======
  addToCartController,
  getCartController,
  editQuantityonCartController,
  deleteProductCartController,
>>>>>>> 857df14ed78eca14f7717a33af4a20ea8badb0e4
};
