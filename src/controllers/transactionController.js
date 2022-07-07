const { dbCon } = require("../connection");
const fs = require("fs");

const uploadReceipe = async (req, res) => {
  let path = "/prescription-photo";
  let pathRec = "prescription-photo";
  const data = JSON.parse(req.body.data);
  const { prescription_photo } = req.files;
  const imagePathRec = prescription_photo
    ? `${path}${pathRec}/${prescription_photo[0].filename}`
    : null;
  if (imagePathRec) {
    data.prescription_photo = imagePathRec;
  }
  const { id } = req.user;
  let conn, sql;
  try {
    conn = await dbCon.promise().getConnection();
    await conn.beginTransaction();
    sql = `SELECT * FROM users JOIN orders ON (users.id = orders.user_id) WHERE users.id = ?`;
    let [result] = await conn.query(sql, [id]);
    if (!result.length) {
      throw { message: "id not found" };
    }
    // sql = `SELECT id FROM users WHERE username = ?`;
    // let [usernameFound] = await conn.query(sql, data.username);
    // // error jika tidak unique
    // if (usernameFound.length && usernameFound[0].id !== id) {
    //   throw {
    //     message: "Username has already been used! Try a different one!",
    //   };
    // }
    sql = `UPDATE users JOIN orders ON (users.id = orders.user_id) SET ? WHERE users.id = ?`;
    await conn.query(sql, [data, id]);
    if (imagePathRec && result[0].prescription_photo) {
      fs.unlinkSync(`./public${result[0].prescription_photo}`);
    }
    sql = `SELECT * FROM users JOIN orders ON (users.id = orders.user_id) WHERE users.id = ?`;
    let [result1] = await conn.query(sql, id);
    await conn.commit();
    conn.release();
    return res.status(200).send(result1[0]);
  } catch (error) {
    if (imagePathRec) {
      fs.unlinkSync("./public" + imagePathRec);
    }
    conn.rollback();
    conn.release();
    console.log(error);
    return res.status(500).send({ message: error.message || error });
  }
};

const {
  getPrimaryAddressService,
  getAllAddressesService,
} = require("../services");

const getPrimaryAddressController = async (req, res) => {
  try {
    const data = await getPrimaryAddressService(req);
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
  getPrimaryAddressController,
  getAllAddressesController,
  uploadReceipe,
};
