const express = require("express");
const { dbCon } = require("../connection");
const {
  loginAdminController,
  filterProductsController,
  getOrdersController,
  validPrescriptionController,
  getProductsController,
  newProductController,
  getProductDetailsController,
  editProductController,
  deleteProductController,
  getReportController,
  getNameController,
  addStockController,
  getProductStockController,
} = require("../controllers");
const {
  dateGenerator,
  codeGenerator,
  expireDateGenerator,
} = require("../lib/codeGenerator");
const multer = require("multer");
const { imageProcess } = require("../lib/upload");
const storage = multer.memoryStorage();
const uploads = multer({ storage });

const Router = express.Router();

Router.post("/adminlogin", loginAdminController);
Router.post(
  "/new-product",
  uploads.single("product_photo"),
  newProductController
);
Router.patch(
  "/edit-product",
  uploads.single("product_photo"),
  editProductController
);
Router.get("/filter-products", filterProductsController);
Router.get("/orders/:status", getOrdersController);
Router.post("/order/valid-prescription", validPrescriptionController);
Router.get("/products", getProductsController);
Router.get("/product-details", getProductDetailsController);
Router.delete("/delete-product", deleteProductController);
Router.get("/get-name", getNameController);
Router.post("/add-stock", addStockController);
Router.post("/stok", async (req, res) => {
  let conn, sql;
  try {
    conn = await dbCon.promise().getConnection();
    await conn.beginTransaction();
    const datas = req.body;
    console.log(req.body);

    // let sql = `SELECT pd.product_id, pd.tgl_kadaluarsa, p.stock FROM product_details pd JOIN products p ON (pd.product_id = p.id)`;
    let id = 2;
    let insertData;
    for (const data of datas) {
      const { product_id, tgl_kadaluarsa, stock } = data;
      insertData = {
        product_id,
        tgl_kadaluarsa,
        stock,
      };
      sql = `INSERT INTO product_stock SET ?`;
      await conn.query(sql, insertData);

      insertData = {
        admin_id: id,
        aktivitas: 1,
        masuk: stock,
        sisa: stock,
        product_id,
      };
      sql = `INSERT INTO admin_logger SET ?`;
      await conn.query(sql, insertData);

      if (id === 4) {
        id = 2;
      } else {
        id++;
      }
    }
    // let [data] = await conn.query(sql);

    await conn.commit();
    conn.release();
    return res.status(200).send("success");
  } catch (error) {
    console.log(error);
    await conn.rollback();
    conn.release();
    return res.status(500).send("failed");
  }
});
Router.get("/report", getReportController);
Router.get("/product-stock", getProductStockController);
module.exports = Router;
