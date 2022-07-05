const { dbCon } = require("../connection");
const { beginTransaction } = require("../connection/mysqldb");

const addNewAddressService = async (data) => {
  const { id } = data.user;
  const {
    label,
    nama_depan,
    nama_belakang,
    nomor_hp,
    provinsi,
    kota,
    kode_pos,
    alamat,
    primaryAddress,
  } = data.body;
  console.log(data.body);

  let sql, conn;
  try {
    conn = await dbCon.promise().getConnection();
    await conn.beginTransaction();
    sql = `INSERT INTO address SET ?`;
    let insertData = {
      user_id: id,
      label,
      nama_depan,
      nama_belakang,
      kota: parseInt(kota),
      provinsi: parseInt(provinsi),
      nomor_hp,
      kode_pos,
      alamat,
      primary_address: primaryAddress,
    };
    let [resultAddress] = await conn.query(sql, insertData);

    if (primaryAddress) {
      sql = `SELECT id FROM address WHERE user_id = ? AND primary_address = "1"`;
      let [resultPrimary] = await conn.query(sql, id);
      if (resultPrimary.length) {
        sql = `UPDATE address SET primary_address = "0" WHERE id = ?`;
        await conn.query(sql, resultPrimary[0].id);
      }
      sql = `UPDATE user_details SET address_id = ? WHERE user_id = ?`;
      await conn.query(sql, [resultAddress.insertId, id]);
    }

    await conn.commit();
    conn.release();
  } catch (error) {
    conn.rollback();
    conn.release();
    console.log(error);
    throw new Error(error.message);
  }
};

module.exports = { addNewAddressService };
