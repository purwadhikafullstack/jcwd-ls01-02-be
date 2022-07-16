const express = require("express");
const { dbCon } = require("../connection");
const {
  loginAdminController,
  newProduct,
  filterProductsController,
  getOrdersController,
  validPrescriptionController,
  getProductsController,
} = require("../controllers");
const { dateGenerator, codeGenerator } = require("../lib/codeGenerator");
const Router = express.Router();

Router.post("/adminlogin", loginAdminController);
Router.post("/new-product", newProduct);
Router.get("/filter-products", filterProductsController);
Router.get("/orders/:status", getOrdersController);
Router.post("/order/valid-prescription", validPrescriptionController);
Router.get("/products", getProductsController);
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

module.exports = Router;
