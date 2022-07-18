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
} = require("../controllers");
const {
  dateGenerator,
  codeGenerator,
  productCodeGenerator,
} = require("../lib/codeGenerator");
const Router = express.Router();

Router.post("/adminlogin", loginAdminController);
Router.post("/new-product", newProductController);
Router.patch("/edit-product", editProductController);
Router.get("/filter-products", filterProductsController);
Router.get("/orders/:status", getOrdersController);
Router.post("/order/valid-prescription", validPrescriptionController);
Router.get("/products", getProductsController);
Router.get("/product-details", getProductDetailsController);
Router.post("/order", async (req, res) => {
  // let { id } = req.query;
  // let { id: user_id } = req.user;
  let conn, sql;
  // let { prescription_photo, user_id } = req.body;
  try {
    conn = dbCon.promise();
    let date = dateGenerator();
    let prescription_photo = "/prescriptions/resep.jpg";
    let user_id = 65;
    let insertData = {
      user_id,
      prescription_photo,
      status: 1,
      transaction_code: codeGenerator("RESEP", date, user_id),
    };
    sql = `INSERT INTO orders SET ?`;
    await conn.query(sql, insertData);

    return res.status(200).send("succeded");
  } catch (error) {
    console.log(error);
    return res.status(500).send("failed");
  }
});

Router.patch("/kode", async (req, res) => {
  let conn;
  try {
    conn = await dbCon.promise().getConnection();
    await conn.beginTransaction();
    const datas = req.body;
    console.log(req.body);
    for (const data of datas) {
      const { category, golongan, id } = data;
      let insertData = {
        no_produk: productCodeGenerator(category, golongan, id),
      };
      let sql = `UPDATE products SET ? WHERE id = ?`;
      await conn.query(sql, [insertData, id]);
    }

    await conn.commit();
    conn.release();
    return res.status(200).send("succeed");
  } catch (error) {
    console.log(error);
    await conn.rollback();
    conn.release();
    return res.status(500).send("failed");
  }
});

module.exports = Router;
