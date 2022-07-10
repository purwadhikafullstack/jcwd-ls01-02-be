const {
  adminLoginService,
  newProductService,
  filterProductsService,
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

const newProduct = async (req, res) => {
  try {
    await newProductService(req);
    return res.status(200).send("success");
  } catch (error) {
    console.log(error);
    return res.status(500).send("failed");
  }
};

const filterProductsController = async (req, res) => {
  try {
    console.log(req.query);
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

module.exports = { loginAdminController, newProduct, filterProductsController };
