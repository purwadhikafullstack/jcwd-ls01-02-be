const {
  fetchProductsService,
  fetchProductDetailsService,
  fetchPromoProductsService,
  filterProductService,
} = require("../services");

const fetchProductsController = async (req, res) => {
  try {
    const data = await fetchProductsService(req);

    return res.status(200).send({
      success: true,
      message: "Products' data",
      data,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ success: false, message: error.message || error });
  }
};

const fetchProductDetailsController = async (req, res) => {
  try {
    const data = await fetchProductDetailsService(req);

    return res.status(200).send({
      success: true,
      message: "Products' data",
      data,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ success: false, message: error.message || error });
  }
};

const fetchPromoProductsController = async (req, res) => {
  try {
    const data = await fetchPromoProductsService();

    return res.status(200).send({
      success: true,
      message: "Products' data with highest promo",
      data,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ success: false, message: error.message || error });
  }
};

const filterProductController = async (req, res) => {
  try {
    const data = await filterProductService(req.query);

    return res.status(200).send({
      success: true,
      message: "Product berhasil difilter",
      data,
    });
  } catch (error) {
    return res
      .status(500)
      .send({ success: false, message: error.message || error });
  }
};

const deleteProductController = async (req, res) => {
  const { id } = req.query;
  const data = { id: id };
  try {
    const result = await deleteProductService(data);
    return res.status(200).send({ message: "Delete product success" });
  } catch (error) {
    return res.status(500).send({ message: error.message || error });
  }
};

module.exports = {
  fetchProductsController,
  fetchProductDetailsController,
  fetchPromoProductsController,
  filterProductController,
  deleteProductController,
};
