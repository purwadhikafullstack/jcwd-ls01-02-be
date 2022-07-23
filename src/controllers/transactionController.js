const { dbCon } = require("../connection");
const fs = require("fs");

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

const {
  getPrimaryAddressService,
  getAllAddressesService,
  rejectOrderService,
  confirmOrderService,
  uploadReceipeService,
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
  getPrimaryAddressController,
  getAllAddressesController,
  uploadReceipeController,
  rejectOrderController,
  confirmOrderController,
};
