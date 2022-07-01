const {
  fetchProductsService,
  fetchProductDetailsService,
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

const filterProductController = async (req, res) => {
  try {
    const dataName = await filterProductService(req.query.name);
    // const dataCategory = await filterProductService(req.query.category);

    return res.send({
      status: 200,
      success: true,
      message: "Product berhasil difilter",
      dataName,
    });
    // else if (dataCategory) {
    //   return res.send({
    //     status: 200,
    //     success: true,
    //     message: "Category berhasil difilter",
    //     dataCategory,
    //   });
    // }
  } catch (error) {
    return res.send({ status: 500, message: error.message || error });
  }
};

module.exports = {
  fetchProductsController,
  fetchProductDetailsController,
  filterProductController,
};
