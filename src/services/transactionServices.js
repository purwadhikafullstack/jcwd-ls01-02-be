const { dbCon } = require("../connection");
const db = require("../connection/mysqldb");



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

const getAllTransactionService = async (data) => {

  let conn, sql;

  try {
    conn = dbCon.promise();
    sql = `SELECT orders, user_id, status, date_requested, total, selected_address, shipping_method from orders join user on orders.orders_id = user_id`;
  } catch (error) {
    console.log(error)
    throw new Error(error.message)
  }
};

const rejectOrderService = async (data) => {
  let (orders_id) = data.query
  let sql, conn;
  try {
    conn = dbCon.promise();
    sql = `update orders set status = "Transaksi dibatalkan" where orders_id = ${req.params.orders_id}`;
    console.log(orders_id)
    return orders_id
  } catch (error) {
    console.log(error)
    throw new Error(error.message)
  }
};

const confirmOrderService = async (data) => {
let (orders_id) = data.query
let sql, conn
try {
  conn = dbCon.promise();
  sql = `update orders set status = "Transaksi Diterima" where orders_id = ${req.params.orders_id}`
  console.log(orders_id)
  return orders_id
} catch (error) {
  console.log(error)
  throw new Error (error.message)
  
}
}
module.exports = {
  getPrimaryAddressService,
  getAllAddressesService,
   rejectOrderService, confirmOrderService, getAllTransactionService 
};
