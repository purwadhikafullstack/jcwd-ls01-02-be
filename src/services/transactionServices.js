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

const getPrimaryAddressService = async (data) => {
  const { id } = data.user;
  let { address_id } = data.query;
  if (!address_id) {
    address_id = 0;
  } else {
    address_id = parseInt(address_id);
  }
  let sql, conn;
  try {
    conn = dbCon.promise();

    sql = `SELECT a.id, a.label, a.nama_depan, a.nama_belakang, a.nomor_hp, a.alamat, a.kode_pos, p.province as provinsi, c.id as destination, c.city as kota  FROM address a JOIN provinces p ON (a.provinsi = p.id) JOIN cities c ON (a.kota = c.id) WHERE a.id = ?`;

    let [primaryAddress] = await conn.query(sql, address_id);

    if (!primaryAddress.length) {
      sql = `SELECT a.id, a.label, a.nama_depan, a.nama_belakang, a.nomor_hp, a.alamat, a.kode_pos, p.province as provinsi, c.id as destination, c.city as kota  FROM address a JOIN provinces p ON (a.provinsi = p.id) JOIN cities c ON (a.kota = c.id) WHERE a.user_id = ?  ORDER BY a.id DESC`;
      let [address] = await conn.query(sql, id);

      if (!address.length) {
        return;
      }
      return address[0];
    }

    return primaryAddress[0];
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
};

const getAllAddressesService = async (data) => {
  const { id } = data.user;
  let sql, conn;
  try {
    conn = dbCon.promise();
    sql = `SELECT a.id, a.label, a.nama_depan, a.nama_belakang, a.nomor_hp, a.alamat, a.kode_pos, p.province as provinsi, c.id as destination, c.city as kota  FROM address a JOIN provinces p ON (a.provinsi = p.id) JOIN cities c ON (a.kota = c.id) WHERE a.user_id = ?  ORDER BY a.id DESC`;
    let [addresses] = await conn.query(sql, id);
    console.log(addresses);
    return addresses;
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
};
module.exports = {
  getPrimaryAddressService,
  getAllAddressesService,
  getTransactionService,
};
