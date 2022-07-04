const {
  fetchProductsService,
  fetchProductDetailsService,
  fetchPromoProductsService,
  filterProductService,
} = require("../services");

const fetchProductsController = async (req, res) => {
  try {
    const data = await fetchProductsService(req);

    return res.send({
      status: 200,
      success: true,
      message: "Products' data",
      data,
    });
  } catch (error) {
    console.log(error);
    return res.send({ status: 500, message: error.message || error });
  }
};

const fetchProductDetailsController = async (req, res) => {
  try {
    const data = await fetchProductDetailsService(req);

    return res.send({
      status: 200,
      success: true,
      message: "Products' data",
      data,
    });
  } catch (error) {
    console.log(error);
    return res.send({ status: 500, message: error.message || error });
  }
};

const fetchPromoProductsController = async (req, res) => {
  try {
    const data = await fetchPromoProductsService();

    return res.send({
      status: 200,
      success: true,
      message: "Products' data with highest promo",
      data,
    });
  } catch (error) {
    console.log(error);
    return res.send({ status: 500, message: error.message || error });
  }
};

const filterProductController = async (req, res) => {
  try {
    const data = await filterProductService(req.query);

    return res.send({
      status: 200,
      success: true,
      message: "Product berhasil difilter",
      data,
    });
  } catch (error) {
    return res.send({ status: 500, message: error.message || error });
  }
};
module.exports = {
  fetchProductsController,
  fetchProductDetailsController,
  fetchPromoProductsController,
  filterProductController,
};
