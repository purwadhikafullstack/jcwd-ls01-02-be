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
  console.log({ primaryAddress });

  let sql, conn;
  try {
    conn = await dbCon.promise().getConnection();
    await conn.beginTransaction();
    if (primaryAddress) {
      sql = `SELECT id FROM address WHERE user_id = ? AND primary_address = "1"`;
      let [resultPrimary] = await conn.query(sql, id);
      if (resultPrimary.length) {
        sql = `UPDATE address SET primary_address = "0" WHERE id = ?`;
        await conn.query(sql, resultPrimary[0].id);
      }
    }
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
    console.log(insertData);
    let [resultAddress] = await conn.query(sql, insertData);

    if (primaryAddress) {
      sql = `UPDATE user_details SET address_id = ? WHERE user_id = ?`;
      let [primary] = await conn.query(sql, [resultAddress.insertId, id]);
      sql = `SELECT address_id FROM user_details WHERE user_id =  ?`;
      [primary] = await conn.query(sql, id);
      console.log(primary[0]);
      await conn.commit();
      conn.release();
      return primary[0];
    }
    await conn.commit();
    conn.release();
    return true;
  } catch (error) {
    conn.rollback();
    conn.release();
    console.log(error);
    throw new Error(error.message);
  }
};

const changePrimaryAddressService = async (data) => {
  const { id: user_id } = data.user;
  const { id } = data.body;
  let conn, sql;
  try {
    conn = await dbCon.promise().getConnection();
    await conn.beginTransaction();

    sql = `UPDATE address SET primary_address = "0" WHERE user_id = ?`;
    await conn.query(sql, user_id);

    sql = `UPDATE address SET primary_address= true WHERE id = ?`;
    await conn.query(sql, id);

    sql = `UPDATE user_details SET address_id = ? WHERE user_id = ?`;
    await conn.query(sql, [id, user_id]);

    await conn.commit();
    conn.release();
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
};
module.exports = { addNewAddressService, changePrimaryAddressService };
