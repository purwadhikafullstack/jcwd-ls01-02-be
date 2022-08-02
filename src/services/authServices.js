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
      messageError[0] = "Username yang kamu pilih sudah terdaftar";
    }

    // email checking if it has already been registered
    sql = `SELECT id FROM users WHERE email =?`;
    [result] = await conn.query(sql, email);
    if (result.length) {
      messageError[1] = "Email yang kamu pilih sudah terdaftar";
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
  const { id } = data;
  let conn, sql, result;
  try {
    conn = await dbCon.promise().getConnection();
    sql = `SELECT id, username, email, verified FROM users WHERE id = ?`;
    [result] = await conn.query(sql, id);

    if (result[0].verified) {
      let finalResult;

      sql = `SELECT ud.*, u.id, u.username, u.email, u.verified FROM users u JOIN user_details ud ON (u.id = ud.user_id) WHERE u.id = ?`;
      [result] = await conn.query(sql, id);
      finalResult = { ...result[0] };

      sql = `SELECT c.qty, p.id, p.name, p.price, p.promo, p.stock, p.photo, c.checkout FROM cart c JOIN products p ON (c.product_id = p.id) WHERE c.user_id = ?`;
      [result] = await conn.query(sql, id);
      result = result.map((val) => {
        return {
          ...val,
          checkout: val.checkout ? true : false,
        };
      });
      finalResult = { ...finalResult, cart: result };

      sql = `SELECT p.id, p.name, p.price, p.promo, p.stock, p.photo FROM product_fav f JOIN products p ON (f.product_id = p.id) WHERE f.user_id = ?`;
      [result] = await conn.query(sql, id);
      finalResult = { ...finalResult, fav: [...result] };

      conn.release();
      return finalResult;
    }
    conn.release();
    return result[0];
  } catch (error) {
    throw new Error(error.message);
  }
};

const verificationService = async (data) => {
  const { id } = data.user;
  let conn, sql, result, insertData;
  try {
    conn = await dbCon.promise().getConnection();

    /* 
      beginTransaction method apabila perlu melakukan metode transaksi mysql, dimana apabila terjadi kegagalan diantara query, 
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
  let { username, email, password } = data.body;
  try {
    //  iniatiate pool connection
    conn = await dbCon.promise().getConnection();

    // username/email checking
    let messageError = [];
    sql = `SELECT id, username, email, verified, password FROM users WHERE username = ? or email = ?`;
    [result] = await conn.query(sql, [username, email]);
    if (!result.length) {
      messageError[0] = "Akun yang kamu masukkan tidak terdaftar";
      throw { message: messageError };
    }
    // cek apakah password sudah sesuai
    let hashedPassword = result[0].password;
    let match = await hashMatch(password, hashedPassword);
    if (!match) {
      messageError[0] = "Password yang kamu masukan salah";
      throw { message: messageError };
    }
    const id = result[0].id;
    if (result[0].verified) {
      let finalResult;

      sql = `SELECT ud.*, u.id, u.username, u.email, u.verified FROM users u JOIN user_details ud ON (u.id = ud.user_id) WHERE u.id = ?`;
      [result] = await conn.query(sql, id);
      finalResult = { ...result[0] };

      sql = `SELECT c.qty, p.id, p.name, p.price, p.promo, p.stock, p.photo, c.checkout FROM cart c JOIN products p ON (c.product_id = p.id) WHERE c.user_id = ?`;
      [result] = await conn.query(sql, id);
      result = result.map((val) => {
        return {
          ...val,
          checkout: val.checkout ? true : false,
        };
      });
      finalResult = { ...finalResult, cart: result };

      sql = `SELECT p.id, p.name, p.price, p.promo, p.stock, p.photo FROM product_fav f JOIN products p ON (f.product_id = p.id) WHERE f.user_id = ?`;
      [result] = await conn.query(sql, id);
      finalResult = { ...finalResult, fav: [...result] };

      conn.release();
      return finalResult;
    }
    conn.release();
    return result[0];
  } catch (error) {
    conn.release();
    console.log(error);
    throw new Error(error.message);
  }
};

const changePasswordService = async (data) => {
  const { id } = data.user;
  let { oldPassword, newPassword } = data.body;
  console.log(data.body);
  let sql, conn, result;

  try {
    conn = await dbCon.promise().getConnection();

    sql = `SELECT * FROM users WHERE id = ?`;
    [result] = await conn.query(sql, [id]);

    const hashedPassword = result[0].password;

    const match = await hashMatch(oldPassword, hashedPassword);
    console.log("match:", match);

    if (!match) {
      throw { message: "Incorrect Password" };
    }

    newPassword = await hashPassword(newPassword);

    sql = `UPDATE users SET password = ? WHERE id = ?`;
    await conn.query(sql, [newPassword, id]);

    conn.release();
  } catch (error) {
    conn.release();
    throw new Error(error.message);
  }
};

const profilePictureService = async (data) => {
  // Mengirim Profile Picture (Data disimpan di BODY -> Form Data) dan TOKEN jangan lupa disimpan di headers
  // Melakukan Pengecekan apakah user ada atau engga? Dengan cara di cek id nya terdaftar/login tidak?
  // kalau user ada melakukan "Menambahkan Photo" dan "Edit Photo", dan kalau usernya tidak ada throw error saja.
  // Kalau user ada, melakukan add photo..
  // Setelah itu, datanya disimpan kedalam sebuah variabel
  // Kalau file fotonya besar, masukan pengkondisian dan kasih error
  // Kalau user ingin update photo, lakukan query update
  // Setelah itu datanya disimpan kedalam sebuah variabel

  // let path = "/profile-photos";
  // let pathAva = "/profile-picture";
  const { id } = data.user;

  let { addPhoto, editPhoto } = data.body;
  // kenapa data.body? kenapa tidak hanya data saja? apa perbedaannya?

  let sql, conn, result;

  try {
    conn = await dbCon.promise().getConnection();

    sql = `SELECT * FROM users WHERE id = ?`;
    [result] = await conn.query(sql, [id]);

    // sql = `SELECT * FROM users JOIN user_details ON (users.id = user_details.user_id) WHERE users.id = ?`;
    // [result] = await conn.query(sql, [id]);

    sql = `UPDATE user_details SET profile_picture = ? WHERE user_id = ?`;
    [result] = await conn.query(sql, [addPhoto, id]);

    sql = `UPDATE user_details SET profile_picture = ? WHERE user_id = ?`;
    [result] = await conn.query(sql, [editPhoto, id]);

    conn.release();
  } catch (error) {
    conn.release();
    throw new Error(error.message);
  }
};

const forgotPasswordService = async (data) => {
  const { email } = data.body;
  let sql, conn;
  try {
    conn = dbCon.promise();
    sql = `SELECT id, username, email FROM users where email = ?`;
    let [result] = await conn.query(sql, email);
    if (!result.length) {
      throw { message: "Email tidak terdaftar" };
    }
    return result[0];
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
};

module.exports = {
  registerService,
  keepLoginService,
  verificationService,
  loginService,
  changePasswordService,
  profilePictureService,
  forgotPasswordService,
};
