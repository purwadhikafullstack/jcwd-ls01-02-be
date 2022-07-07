const { dbCon } = require("../connection");
const db = require("../connection/mysqldb");

const getTransactionService = async (data) => {
  let { orders } = data.params;
  let conn, sql;

  try {
    conn = dbCon.promise();
    sql = `SELECT * FROM checkout_cart td inner join orders on td. `;
  } catch (error) {}
};

// const confirmTransaction = async (data) => {
//   let confirmQuery = `UPDATE orders set orders_status = "Order Berhasil" where orders_id = ${req.params.orders_id}; `;
//   console.log(confirmQuery);

//   db.query(confirmQuery, (err, result) => {
//     if (err) res.status(500).send(err);
//     res.status(200).send(result);
//   });
// };

// const rejectTransaction = async (data) => {
//   let rejectQuery = `UPDATE orders set orders_status = "Transaksi Dibatalkan" where orders_id = ${req.params.orders_id}`;
//   console.log(rejectQuery);

//   db.query(rejectQuery, (err, result) => {
//     if (err) res.status(500).send(err);
//     res.status(200).send(result);
//   });
// };

// const getAllTransaction = async (data) => {
//   let { order, page, limit } = data.query;
//   console.log(page);
//   page = parseInt(page);
//   limit = parseInt(limit);
//   let offset = limit * page;
//   let conn, sql;
//   try {
//     conn = dbCon.promise();
//     let AllTransactionQuery = `SELECT * from order_id, users_username, orders_status, orders_date `;
//   } catch (error) {}
// };
