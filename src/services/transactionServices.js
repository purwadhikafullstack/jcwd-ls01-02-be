const { dbCon } = require("../connection");
const { query } = require("../connection/mysqldb");
const db = require("../connection/mysqldb");
const {
  dateGenerator,
  photoNameGenerator,
  codeGenerator,
} = require("../lib/codeGenerator");
const { imageProcess } = require("../lib/upload");

const getPrimaryAddressService = async (data) => {
  const { id } = data.user;
  let { address_id } = data.query;
  if (!address_id) {
    address_id = 0;
  } else {
    address_id = parseInt(address_id);
  }
  console.log(address_id);
  let sql, conn;
  try {
    conn = await dbCon.promise().getConnection();

    if (!address_id) {
      sql = `SELECT a.id, a.label, a.nama_depan, a.nama_belakang, a.nomor_hp, a.alamat, a.kode_pos, a.primary_address, p.province as provinsi, c.id as destination, c.city as kota  FROM address a JOIN provinces p ON (a.provinsi = p.id) JOIN cities c ON (a.kota = c.id) WHERE a.user_id = ? AND primary_address = true`;
      let [address] = await conn.query(sql, id);
      if (!address.length) {
        sql = `SELECT a.id, a.label, a.nama_depan, a.nama_belakang, a.nomor_hp, a.alamat, a.kode_pos, p.province as provinsi, c.id as destination, c.city as kota  FROM address a JOIN provinces p ON (a.provinsi = p.id) JOIN cities c ON (a.kota = c.id) WHERE a.user_id = ?  ORDER BY a.id DESC`;
        [address] = await conn.query(sql, id);
      }
      if (!address.length) {
        throw { message: "Belum memiliki alamat" };
      }
      return address[0];
    }

    sql = `SELECT a.id, a.label, a.nama_depan, a.nama_belakang, a.nomor_hp, a.alamat, a.kode_pos, p.province as provinsi, c.id as destination, c.city as kota  FROM address a JOIN provinces p ON (a.provinsi = p.id) JOIN cities c ON (a.kota = c.id) WHERE a.id = ?`;

    let [primaryAddress] = await conn.query(sql, address_id);
    conn.release();

    return primaryAddress[0];
  } catch (error) {
    console.log(error);
    conn.release();
    throw new Error(error.message);
  }
};

const getAllAddressesService = async (data) => {
  const { id } = data.user;
  let sql, conn;
  try {
    conn = dbCon.promise();
    sql = `SELECT a.id, a.label, a.nama_depan, a.nama_belakang, a.nomor_hp, a.alamat, a.kode_pos, a.provinsi as kode_provinsi, p.province as provinsi, a.kota as kode_kota, c.id as destination, c.city as kota, a.primary_address  FROM address a JOIN provinces p ON (a.provinsi = p.id) JOIN cities c ON (a.kota = c.id) WHERE a.user_id = ?  ORDER BY a.id DESC`;
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
  getPrimaryAddressService,
  getAllAddressesService,
  rejectOrderService,
  confirmOrderService,
  getAllTransactionService,
  uploadReceipeService,
};
