const { dbCon } = require("../connection");
const fs = require("fs");
const {
  rejectOrderService,
  confirmOrderService,
  uploadReceipeService,
} = require("../services");

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
};
