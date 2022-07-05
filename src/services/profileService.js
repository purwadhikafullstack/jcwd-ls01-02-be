const { dbCon } = require("../connection");

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
    conn = dbCon.promise();
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
      primary: primaryAddress,
    };
    await conn.query(sql, insertData);
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
};

module.exports = { addNewAddressService };
