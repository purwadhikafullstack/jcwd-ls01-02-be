const { adminLoginService } = require("../services");

const loginAdminController = async (req, res) => {
  try {
    // calling admin service for  data validation and data insertion to database
    await adminLoginService(req.body);

    return res.status(200).send({ message: "Login success" });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: error.message });
  }
};

module.exports = { loginAdminController };
