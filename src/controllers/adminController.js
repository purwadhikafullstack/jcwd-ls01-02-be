const db = require("../connection/mysqldb");
const { adminLoginService, newProductService } = require("../services");

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

module.exports = { loginAdminController, newProduct };
