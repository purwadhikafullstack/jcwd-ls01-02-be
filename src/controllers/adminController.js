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
  getNameService,
  addStockService,
  getProductStockService,
} = require("../services");

const loginAdminController = async (req, res) => {
  try {
    const data = await adminLoginService(req.body);
    return res.status(200).send(data);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: error.message });
  }
};

const newProductController = async (req, res) => {
  try {
    await newProductService(req);
    return res.status(200).send("success");
  } catch (error) {
    console.log(error);
    return res.status(500).send("failed");
  }
};

const editProductController = async (req, res) => {
  try {
    await editProductService(req);
    return res.status(200).send("success");
  } catch (error) {
    console.log(error);
    return res.status(500).send("failed");
  }
};

const filterProductsController = async (req, res) => {
  try {
    const data = await filterProductsService(req);
    return res.status(200).send({
      success: true,
      message: "Product filter",
      data,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ success: false, message: error.message || error });
  }
};

const getOrdersController = async (req, res) => {
  try {
    const data = await getOrdersService(req);
    return res.status(200).send({
      success: true,
      message: "Order ditampilkan",
      data,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ success: false, message: error.message || error });
  }
};

const validPrescriptionController = async (req, res) => {
  try {
    await validPrescriptionService(req);
    return res.status(200).send({
      success: true,
      message: "Valid Prescription",
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ success: false, message: error.message || error });
  }
};

const getProductsController = async (req, res) => {
  try {
    const data = await getProductsService(req);
    return res.status(200).send({
      success: true,
      message: "Data Products",
      data,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ success: false, message: error.message || error });
  }
};

const getProductDetailsController = async (req, res) => {
  try {
    const data = await getProductDetailsService(req);
    return res.status(200).send({
      success: true,
      message: "Data Product's Details",
      data,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ success: false, message: error.message || error });
  }
};

const deleteProductController = async (req, res) => {
  try {
    console.log("ini delete");
    console.log(req.query.id);
    const data = await deleteProductService(req);
    return res.status(200).send({
      success: true,
      message: "Delete Product Success",
      data,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ success: false, message: error.message });
  }
};

const getReportController = async (req, res) => {
  try {
    const data = await getReportService(req);
    return res.status(200).send({
      success: true,
      message: "Data Report",
      data,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ success: false, message: error.message || error });
  }
};

const getNameController = async (req, res) => {
  try {
    const data = await getNameService(req);
    return res.status(200).send({
      success: true,
      message: "Data Product's name",
      data,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ success: false, message: error.message || error });
  }
};

const addStockController = async (req, res) => {
  try {
    await addStockService(req);
    return res.status(200).send({
      success: true,
      message: "Stok berhasil bertambah",
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ success: false, message: error.message || error });
  }
};

const getProductStockController = async (req, res) => {
  try {
    const data = await getProductStockService(req);
    return res.status(200).send({
      success: true,
      message: "Stok berhasil ditampilkan",
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
  loginAdminController,
  newProductController,
  filterProductsController,
  getOrdersController,
  validPrescriptionController,
  getProductsController,
  getProductDetailsController,
  editProductController,
  deleteProductController,
  getReportController,
  getNameController,
  addStockController,
  getProductStockController,
};
