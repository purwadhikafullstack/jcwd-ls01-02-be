const { dbCon } = require("../connection");
const {
  dateGenerator,
  photoNameGenerator,
  codeGenerator,
} = require("../lib/codeGenerator");
const { imageProcess } = require("../lib/upload");

const getAllTransactionService = async (data) => {
  let conn, sql;

  try {
    conn = dbCon.promise();
    sql = `SELECT orders, user_id, status, date_requested, total, selected_address, shipping_method from orders join user on orders.orders_id = user_id`;
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
};

const rejectOrderService = async (data) => {
  console.log(data.query);

  let sql, conn;
  try {
    conn = dbCon.promise();
    sql = `SELECT * FROM orders where id = ?`;
    await conn.query(sql, [data.query.id]);
    sql = `update orders set status = "Dibatalkan" where id = ${data.query.id}`;
    await conn.query(sql);
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
};

const confirmOrderService = async (data) => {
  console.log(data.query);
  let sql, conn;
  try {
    conn = dbCon.promise();
    sql = `SELECT * FROM orders where id = ?`;
    await conn.query(sql, [data.query.id]);
    sql = `update orders set status = "Pesanan-Diterima" where id = ${data.query.id}`;
    await conn.query(sql);
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
};

const uploadReceipeService = async (data) => {
  const { id } = data.user;
  const dataPhoto = photoNameGenerator(data.file, "/prescriptions", "RESEP");
  console.log(dataPhoto);
  let conn, sql;
  try {
    conn = dbCon.promise();
    let date = dateGenerator();
    let insertData = {
      user_id: id,
      prescription_photo: dataPhoto.photo,
      status: 1,
      transaction_code: codeGenerator("RESEP", date, id),
    };
    sql = `INSERT INTO orders set ?`;
    await conn.query(sql, insertData);
    await imageProcess(data.file, dataPhoto.path);
    return { message: "succes" };
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
};

module.exports = {
  rejectOrderService,
  confirmOrderService,
  getAllTransactionService,
  uploadReceipeService,
};
