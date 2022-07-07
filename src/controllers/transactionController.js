const { dbCon } = require("../connection");
const fs = require("fs");

const uploadReceipe = async (req, res) => {
  let path = "/prescription-photo";
  let pathRec = "prescription-photo";
  const data = JSON.parse(req.body.data);
  const { prescription_photo } = req.files;
  const imagePathRec = prescription_photo
    ? `${path}${pathRec}/${prescription_photo[0].filename}`
    : null;
  if (imagePathRec) {
    data.prescription_photo = imagePathRec;
  }
  const { id } = req.user;
  let conn, sql;
  try {
    conn = await dbCon.promise().getConnection();
    await conn.beginTransaction();
    sql = `SELECT * FROM users JOIN orders ON (users.id = orders.user_id) WHERE users.id = ?`;
    let [result] = await conn.query(sql, [id]);
    if (!result.length) {
      throw { message: "id not found" };
    }
    sql = `SELECT id FROM users WHERE username = ?`;
    let [usernameFound] = await conn.query(sql, data.username);
    // error jika tidak unique
    if (usernameFound.length && usernameFound[0].id !== id) {
      throw {
        message: "Username has already been used! Try a different one!",
      };
    }
    sql = `UPDATE users JOIN orders ON (users.id = orders.user_id) SET ? WHERE users.id = ?`;
    await conn.query(sql, [data, id]);
    if (imagePathRec && result[0].receipe_picture) {
      fs.unlinkSync(`./public${result[0].prescription_photo}`);
    }
    sql = `SELECT * FROM users JOIN orders ON (users.id = orders.user_id) WHERE users.id = ?`;
    let [result1] = await conn.query(sql, id);
    await conn.commit();
    conn.release();
    return res.status(200).send(result1[0]);
  } catch (error) {
    if (imagePathRec) {
      fs.unlinkSync("./public" + imagePathRec);
    }
    conn.rollback();
    conn.release();
    console.log(error);
    return res.status(500).send({ message: error.message || error });
  }
};

const getTransactionData = async (data) => {
  let getTransactionDataQuery = `SELECT * from `;
};

const confirmTransaction = async (data) => {
  let confirmQuery = `UPDATE orders set orders_status = "Order Berhasil" where orders_id = ${req.params.orders_id}; `;
  console.log(confirmQuery);

  db.query(confirmQuery, (err, result) => {
    if (err) res.status(500).send(err);
    res.status(200).send(result);
  });
};

const rejectTransaction = async (data) => {
  let rejectQuery = `UPDATE orders set orders_status = "Transaksi Dibatalkan" where orders_id = ${req.params.orders_id}`;
  console.log(rejectQuery);

  db.query(rejectQuery, (err, result) => {
    if (err) res.status(500).send(err);
    res.status(200).send(result);
  });
};

const getAllTransaction = async (data) => {
  let { order, page, limit } = data.query;
  console.log(page);
  page = parseInt(page);
  limit = parseInt(limit);
  let offset = limit * page;
  let conn, sql;
  try {
    conn = dbCon.promise();
    let AllTransactionQuery = `SELECT * from order_id, users_username, orders_status, orders_date `;
  } catch (error) {}
};

// const getUserDetails = async (req, res) => {
//   console.log(req.query);
//   const { profile_username } = req.query;
//   let sql, conn;
//   try {
//     conn = dbCon.promise();
//     sql = `SELECT * FROM users JOIN user_details ON (users.id = user_details.user_id) WHERE users.username = ?`;
//     let [result1] = await conn.query(sql, profile_username);
//     if (!result1.length) {
//       throw { message: "Chef not found" };
//     }
//     return res.status(200).send(result1[0]);
//   } catch (error) {
//     return res.status(500).send({ message: error.message || error });
//   }
// };

module.exports = { uploadReceipe };
