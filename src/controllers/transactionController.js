const {
  addToCartServices,
  getCartServices,
  editQuantityonCartServices,
  deleteProductCartServices,
  getPrimaryAddressService,
  getAllAddressesService,
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
    const data = await deleteProductCartServices(req);
    return res.send({
      status: 200,
      success: true,
      message: "Berhasil untuk Menghapus Product didalam Cart",
      data,
    });
  } catch (error) {
    return res.status(500).send({ message: error.message || error });
  }
};

const getPrimaryAddressController = async (req, res) => {
  try {
    const data = await getPrimaryAddressService(req);
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

module.exports = {
  getPrimaryAddressController,
  getAllAddressesController,
  addToCartController,
  getCartController,
  editQuantityonCartController,
  deleteProductCartController,
};
