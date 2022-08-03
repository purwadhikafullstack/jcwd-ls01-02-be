const { dbCon } = require("../connection");
const fs = require("fs");
const {
  addNewAddressService,
  changePrimaryAddressService,
  getAllAddressesService,
  getPrimaryAddressService,
  editAddressService,
} = require("../services");

const updateProfile = async (req, res) => {
  console.log(req.files);
  let path = "/profile-photos";
  const data = JSON.parse(req.body.data);
  const { profile_picture } = req.files;
  const imagePathAva = profile_picture
    ? `${path}/${profile_picture[0].filename}`
    : null;

  if (imagePathAva) {
    data.profile_picture = imagePathAva;
  }
  console.log(data);

  const { id } = req.user;
  let conn, sql;
  try {
    conn = await dbCon.promise().getConnection();
    await conn.beginTransaction();

    sql = `SELECT * FROM users JOIN user_details ON (users.id = user_details.user_id) WHERE users.id = ?`;
    let [result] = await conn.query(sql, [id]);
    if (!result.length) {
      throw { message: "id not found" };
    }

    sql = `SELECT id FROM users WHERE username = ?`;
    let [usernameFound] = await conn.query(sql, data.username);
    // error jika tidak unique
    if (usernameFound.length && usernameFound[0].id !== id) {
      throw {
        message: "Username has already been used! Try a different one!",
      };
    }

    // sql = `UPDATE user_details JOIN users ON (user_details.user_id = users.id) JOIN address ON (user_details.address_id = address.id)
    // SET ? WHERE user_details.user_id = ?`;
    sql = `UPDATE users JOIN user_details ON (users.id = user_details.user_id) SET ? WHERE users.id = ?`;
    await conn.query(sql, [data, id]);

    // if (imagePathAva && result[0].profile_picture) {
    //   fs.unlinkSync(`./public${result[0].profile_picture}`);
    // }

    sql = `SELECT * FROM user_details JOIN users ON (user_details.user_id = users.id) JOIN address ON (user_details.address_id = address.id)
   WHERE users.id = ?`;
    let [result1] = await conn.query(sql, id);
    console.log(result1);
    await conn.commit();
    conn.release();
    return res.status(200).send(result1[0]);
  } catch (error) {
    if (imagePathAva) {
      fs.unlinkSync("./public" + imagePathAva);
    }
    conn.rollback();
    conn.release();
    console.log(error);
    return res.status(500).send({ message: error.message || error });
  }
};

const getUserDetails = async (req, res) => {
  console.log(req.query);
  const { profile_username } = req.query;
  let sql, conn;
  try {
    conn = dbCon.promise();
    sql = `SELECT * FROM users JOIN user_details ON (users.id = user_details.user_id) WHERE users.username = ?`;
    let [result1] = await conn.query(sql, profile_username);
    if (!result1.length) {
      throw { message: "User not found" };
    }
    return res.status(200).send(result1[0]);
  } catch (error) {
    return res.status(500).send({ message: error.message || error });
  }
};

const addNewAddressController = async (req, res) => {
  try {
    const data = await addNewAddressService(req);
    return res.status(200).send({
      success: true,
      message: "Alamat baru berhasil ditambahkan",
      data,
    });
  } catch (error) {
    return res.status(500).send("gagal");
  }
};

const changePrimaryAddressController = async (req, res) => {
  try {
    const data = await changePrimaryAddressService(req);
    return res.status(200).send({
      success: true,
      message: "Primary Address Berhasil diubah, data semua address",
      data,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ success: false, message: error.message });
  }
};

const editAddressController = async (req, res) => {
  try {
    const data = await editAddressService(req);
    return res.status(200).send({
      success: true,
      message: "Address berhasil diubah, data semua address",
      data,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ success: false, message: error.message });
  }
};

const getPrimaryAddressController = async (req, res) => {
  try {
    const data = await getPrimaryAddressService(req);
    console.log(data);
    return res.status(200).send({
      success: true,
      message: "Primary Address",
      data,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ success: false, message: error.message });
  }
};

const getAllAddressesController = async (req, res) => {
  try {
    const data = await getAllAddressesService(req);
    return res.status(200).send({
      success: true,
      message: "All Addresses",
      data,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ success: false, message: error.message });
  }
};

module.exports = {
  updateProfile,
  getUserDetails,
  addNewAddressController,
  changePrimaryAddressController,
  editAddressController,
  getAllAddressesController,
  getPrimaryAddressController,
};
