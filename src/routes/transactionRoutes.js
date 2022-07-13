const express = require("express");
const { dbCon } = require("../connection");
const {
  getPrimaryAddressController,
  getAllAddressesController,
} = require("../controllers");
const { verifyToken } = require("../lib");
const { dateGenerator, codeGenerator } = require("../lib/codeGenerator");

const Router = express.Router();

Router.get("/primary-address", verifyToken, getPrimaryAddressController);
Router.get("/all-addresses", verifyToken, getAllAddressesController);
Router.post("/order", async (req, res) => {
  // let { id } = req.query;
  // let { id: user_id } = req.user;
  // let conn, sql;
  // let { prescription_photo, user_id } = req.body;
  try {
    // conn = dbCon.promise();
    let date = dateGenerator();
    let user_id = 60000;
    // let insertData = {
    //   user_id,
    //   prescription_photo,
    //   status: 1,
    let transaction_code = codeGenerator("LANGSUNG", date, user_id);
    // };
    // sql = `INSERT INTO orders SET ?`;
    // await conn.query(sql, insertData);

    return res.status(200).send(transaction_code);
  } catch (error) {
    console.log(error);
    return res.status(500).send("failed");
  }
});

module.exports = Router;
