const { dbCon } = require("../connection");
const { hashPassword, hashMatch } = require("../lib");

const registerService = async (data) => {
  let conn, sql, result, insertData;
  let { username, email, password } = data.body;
  try {
    // initiate pool connection
    conn = await dbCon.promise().getConnection();

    // username checking if it has already been registered
    let messageError = [];
    sql = `SELECT id FROM users WHERE username = ?`;

    [result] = await conn.query(sql, username);
    if (result.length) {
      messageError[0] = "Username has already been registered";
    }

    // email checking if it has already been registered
    sql = `SELECT id FROM users WHERE email =?`;
    [result] = await conn.query(sql, email);
    if (result.length) {
      messageError[1] = "Email has already been registered";
    }

    // throw error if both validations true
    if (messageError.length) {
      throw { message: messageError };
    }

    // if the data passed through the validation, input the data to the database
    sql = `INSERT INTO users SET ?`;
    insertData = {
      username,
      email,
      password: await hashPassword(password),
    };
    [result] = await conn.query(sql, insertData);

    sql = `SELECT id, username, email, verified from users where id = ?`;
    [result] = await conn.query(sql, [result.insertId]);
    // release the connection
    conn.release();
    let data = result[0];
    return data;
  } catch (error) {
    conn.release();
    console.log(error);
    throw new Error(error.message);
  }
};

const keepLoginService = async (data) => {
  const { id } = data.user;
  let conn, sql, result;
  try {
    conn = await dbCon.promise().getConnection();
    sql = `SELECT * FROM users WHERE id = ?`;
    [result] = await conn.query(sql, id);

    if (result[0].verified) {
      sql =
        `SELECT * FROM users JOIN user_details ON (users.id = user_details.user_id) WHERE users.id = ?`[
          result
        ] = await conn.query(sql, id);
      conn.release();
      return result[0];
    }
    conn.release();
    return result[0];
  } catch (error) {
    throw new Error((error.message = "Something went wrong :("));
  }
};

const verificationService = async (data) => {
  const { id } = data.user;
  let conn, sql, result, insertData;
  try {
    conn = await dbCon.promise().getConnection();

    /* 
      beginTranscation method apabila perlu melakukan metode transaksi mysql, dimana apabila terjadi kegagalan diantara query, 
      semua query yang sudah berhasil dilakukan dapat di-rollback atau dihapus agar tidak terjadi pemngubahan data yang tidak utuh
    */
    await conn.beginTransaction();

    // Mengecek apabila user telah terverifikasi
    sql = `SELECT id FROM users WHERE id = ? AND verified = 1`;
    [result] = await conn.query(sql, id);
    if (result.length) {
      throw { message: "Your account is already verified" };
    }

    // Melakukan verifikasi apabila kondisi di atas salah
    sql = `UPDATE users SET ? WHERE id = ?`;
    insertData = {
      verified: 1,
    };
    await conn.query(sql, [insertData, id]);

    // Menambahkan row ke user details
    sql = `INSERT INTO user_details SET ?`;
    insertData = {
      user_id: id,
    };
    await conn.query(sql, insertData);

    sql = `SELECT id, username, email, verified from users where id = ?`;
    [result] = await conn.query(sql, id);

    // Apabila transaksi berhasil, gunakan metode conn.commit untuk mengakhiri transaksi
    await conn.commit();
    conn.release();

    return result[0];
  } catch (error) {
    // Apabila transaksi gagal, gunakan metode conn.rollback untuk mengakhiri transaksi dan menghapus semua data yang sudah masuk ke database
    conn.rollback();
    conn.release();
    console.log(error);
    throw new Error(error.message);
  }
};

const loginService = async (data) => {
  let conn, sql, result;
  let { username, email, password } = data;
  try {
    //  iniatiate pool connection
    conn = await dbCon.promise().getConnection();

    // username/email checking
    let messageError = [];
    sql = `SELECT * FROM users WHERE username = ? or email = ?`;
    [result] = await conn.query(sql, [username, email]);
    if (!result.length) {
      messageError[0] = "Username or Email does not exist ⚠️";
      throw { message: messageError };
    }
    // cek apakah password sudah sesuai
    let hashedPassword = result[0].password;
    result[0];
    let match = await hashMatch(password, hashedPassword);
    // console.log(match);
    if (!match) {
      messageError[1] = "Inncorect Password ⚠️";
      throw { message: messageError };
    }
    if (result[0].verified) {
      sql = `SELECT * FROM users JOIN user_details ON (users.id = user_details.user_id) WHERE users.id = ?`;
      let [resultVerified] = await conn.query(sql, result[0].id);
      conn.release();
      return result[0];
    } else {
      conn.release();
      return result[0];
    }
  } catch (error) {
    conn.release();
    console.log(error);
    throw new Error(error.message);
  }
};
module.exports = {
  registerService,
  keepLoginService,
  verificationService,
  loginService,
};
