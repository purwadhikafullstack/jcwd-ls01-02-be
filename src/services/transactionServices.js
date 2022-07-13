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

const uploadReceipeService = async (data) => {
  const { id } = data
  console.log("ini req", data.file)
  let path = "/prescription-photo";
//   const imagePath = prescription_photo
//   ? `${path}${prescription_photo[0].filename}`
//     : null;
//   console.log(imagePath)
// if (imagePath) {
//   data.prescription_photo = imagePath;
// }
let conn, sql;
try {
  conn = await dbCon.promise().getConnection()
  sql = `select prescription_photo from orders where id = ?`
  let [result0] = await conn.query(sql, id)
  console.log(result0, "ini photo");
  console.log(result0.length, "ini length");

  if (imagePath) {
    if (result0[0].prescription_photo) {
      fs.unlinkSync("./public" + result0.prescription_photo)
    }
  }
  sql = `update users set ? where id = ?`
  let updateData = {
    prescription_photo : imagePath
  }
  await conn.query(sql, [updateData, id])
  sql = `select prestriction_photo from orders where id = ?`
  let [result] = await conn.query(sql, id)
  conn.release()
  return res.status(200).send(result[0])
} catch (error) {
  console.log(error)
  throw new Error(error.message)
  
}
}
module.exports = {
  getPrimaryAddressService,
  getAllAddressesService,
   rejectOrderService, confirmOrderService, getAllTransactionService , uploadReceipeService
};
