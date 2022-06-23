const { adminLoginService } = require("../services");

const loginAdminController = async (req, res) => {
  try {
    const data = await adminLoginService(req.body);

    return res.status(200).send(data);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: error.message });
  }
};

module.exports = { loginAdminController };
