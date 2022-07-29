const { dbCon } = require("../connection");

const getAllAddressesService = async (data) => {
  const { id } = data.user;
  let sql, conn;
  try {
    conn = dbCon.promise();
    sql = `SELECT a.id, a.label, a.nama_depan, a.nama_belakang, a.nomor_hp, a.alamat, a.kode_pos, a.provinsi as kode_provinsi, p.province as provinsi, a.kota as kode_kota, c.id as destination, c.city as kota, a.primary_address  FROM address a JOIN provinces p ON (a.provinsi = p.id) JOIN cities c ON (a.kota = c.id) WHERE a.user_id = ?  ORDER BY a.id DESC`;
    let [addresses] = await conn.query(sql, id);
    addresses = addresses.map((val) => {
      return {
        ...val,
        primary_address: val.primary_address === 1 ? true : false,
      };
    });
    return addresses;
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
};

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
    let [resultAddress] = await conn.query(sql, insertData);

    if (primaryAddress) {
      sql = `UPDATE user_details SET address_id = ? WHERE user_id = ?`;
      let [primary] = await conn.query(sql, [resultAddress.insertId, id]);
      sql = `SELECT address_id FROM user_details WHERE user_id =  ?`;
      [primary] = await conn.query(sql, id);
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

const editAddressService = async (data) => {
  const { id: user_id } = data.user;
  const {
    id,
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

  let sql, conn, primaryId;
  try {
    conn = await dbCon.promise().getConnection();
    await conn.beginTransaction();
    sql = `SELECT id FROM address WHERE user_id = ? AND primary_address = "1"`;
    let [resultPrimary] = await conn.query(sql, user_id);
    primaryId = resultPrimary[0]?.id;
    if (primaryAddress) {
      if (primaryId && primaryId !== id) {
        sql = `UPDATE address SET primary_address = "0" WHERE id = ?`;
        await conn.query(sql, primaryId);
      }
    }
    sql = `UPDATE address SET ? WHERE id = ?`;
    let insertData = {
      label,
      nama_depan,
      nama_belakang,
      kota: Number(kota),
      provinsi: Number(provinsi),
      nomor_hp,
      kode_pos,
      alamat,
      primary_address: primaryAddress,
    };
    await conn.query(sql, [insertData, id]);

    sql = `SELECT a.id, a.label, a.nama_depan, a.nama_belakang, a.nomor_hp, a.alamat, a.kode_pos, a.provinsi as kode_provinsi, p.province as provinsi, a.kota as kode_kota, c.id as destination, c.city as kota, a.primary_address  FROM address a JOIN provinces p ON (a.provinsi = p.id) JOIN cities c ON (a.kota = c.id) WHERE a.user_id = ?  ORDER BY a.id DESC`;
    let [addresses] = await conn.query(sql, user_id);
    addresses = addresses.map((val) => {
      return {
        ...val,
        primary_address: val.primary_address === 1 ? true : false,
      };
    });
    if (primaryAddress && (primaryId !== id || !primaryId)) {
      sql = `UPDATE user_details SET address_id = ? WHERE user_id = ?`;
      await conn.query(sql, [id, user_id]);
      sql = `SELECT address_id FROM user_details WHERE user_id =  ?`;
      let [primary] = await conn.query(sql, user_id);
      await conn.commit();
      conn.release();
      return { addresses, primary };
    }
    if (!primaryAddress && primaryId === id) {
      sql = `UPDATE user_details SET address_id = null WHERE user_id = ?`;
      await conn.query(sql, user_id);
      await conn.commit();
      conn.release();

      return { addresses, primary: "" };
    }
    await conn.commit();
    conn.release();
    return { addresses };
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

    sql = `SELECT a.id, a.label, a.nama_depan, a.nama_belakang, a.nomor_hp, a.alamat, a.kode_pos, a.provinsi as kode_provinsi, p.province as provinsi, a.kota as kode_kota, c.id as destination, c.city as kota, a.primary_address  FROM address a JOIN provinces p ON (a.provinsi = p.id) JOIN cities c ON (a.kota = c.id) WHERE a.user_id = ?  ORDER BY a.id DESC`;
    let [addresses] = await conn.query(sql, user_id);
    addresses = addresses.map((val) => {
      return {
        ...val,
        primary_address: val.primary_address === 1 ? true : false,
      };
    });
    await conn.commit();
    conn.release();
    return addresses;
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
};

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

module.exports = {
  addNewAddressService,
  changePrimaryAddressService,
  editAddressService,
  getAllAddressesService,
  getPrimaryAddressService,
};
