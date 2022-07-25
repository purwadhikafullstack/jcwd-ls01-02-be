const express = require("express");
const { dbCon } = require("../connection");
const {
  fetchProductsController,
  fetchProductDetailsController,
  fetchPromoProductsController,
  filterProductController,
} = require("../controllers");

const Router = express.Router();

Router.get("/products/:category", fetchProductsController);
Router.get("/product-name-category", filterProductController);
Router.get("/product-details/:product_name", fetchProductDetailsController);
Router.get("/promo-products", fetchPromoProductsController);
Router.get("/temp", async (req, res) => {
  let conn, sql;
  try {
    conn = await dbCon.promise().getConnection();
    await conn.beginTransaction();
    sql = `SELECT satuan, golongan, product_id FROM product_details ORDER BY product_id`;
    let [result] = await conn.query(sql);
    result = result.map((val) => {
      satuan = val.satuan.toLowerCase().split("");
      satuan[0] = satuan[0].toUpperCase();
      satuan = satuan.join("");
      return { satuan, golongan: val.golongan, id: val.product_id };
    });
    console.log(result);

    for (let product of result) {
      sql = `UPDATE products SET satuan = ?, golongan = ? WHERE id = ?`;
      await conn.query(sql, [product.satuan, product.golongan, product.id]);
    }
    await conn.commit();
    conn.release();
    return res.status(200).send(result);
  } catch (error) {
    console.log(error);
    conn.rollback();
    conn.release();
    return res.status(500).send(result);
  }
});

module.exports = Router;
