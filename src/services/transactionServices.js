const { dbCon } = require("../connection");
const {
  dateGenerator,
  photoNameGenerator,
  codeGenerator,
} = require("../lib/codeGenerator");
const { imageProcess } = require("../lib/upload");

const addToCartServices = async (data) => {
  const { id } = data.user;
  const { productId, quantity } = data.body;
  // console.log(data.user, ">>>>>>>>>>");
  // console.log(data.body, ">>>>>>>>>>BODYYYY");
  let sql, conn;

  try {
    conn = await dbCon.promise().getConnection();

    sql = `SELECT COUNT(*) product_id FROM cart WHERE user_id = ? AND product_id = ?`;

    let [resultProductExist] = await conn.query(sql, [id, productId]);
    // console.log(resultProductExist, ">>>>>>>>>>>>>RESULT PRODUCT EXXIST");
    if (resultProductExist[0].product_id === 0) {
      sql = `INSERT INTO cart (product_id, qty, user_id) VALUES (?, ?, ?)`;

      let resultInsertProduct = await conn.query(sql, [
        productId,
        quantity,
        id,
      ]);

      // if (!resultInsertProduct) {
      //   throw { message: "Produk gagal ditambahkan" };
      // }
      sql = `SELECT * FROM cart WHERE user_id = ?`;

      let [resultAddtoCart] = await conn.query(sql, [id]);

      return resultAddtoCart;
    } else {
      sql = `SELECT qty FROM cart WHERE user_id = ? AND product_id = ?`;

      let [quantityCart] = await conn.query(sql, [id, productId]);

      sql = `UPDATE cart SET qty = ? WHERE user_id = ? AND product_id = ?`;

      // console.log(quantityCart, ">>>>>>>>>>>QUANTITYY CARTTT");

      let updateQuantity = await conn.query(sql, [
        quantity + quantityCart[0].qty,
        id,
        productId,
      ]);
      // console.log(updateQuantity, ">>>>>>>>>>>>> UPDATE QUANTITY BERHASIL");

      // Harusnya untuk message itu "QUANTITY PRODUCT BERHASIL DITAMBAHKAN"
      if (!updateQuantity) {
        throw { message: "Product tidak berhasil menambahkan Quantity" };
      }

      quantityCart[0].qty += quantity;
      return quantityCart;
    }
  } catch (error) {
    console.log(error);
    throw new Error(error.message || error);
  }
};

const getCartServices = async (data) => {
  const { id } = data.user;
  // console.log(data.user, ">>>>>>>>>>> DATA USER");
  let sql, conn;
  try {
    conn = await dbCon.promise().getConnection();

    sql = `SELECT id, product_id AS productId, qty FROM cart WHERE user_id = ?`;

    let [resultAddToCart] = await conn.query(sql, [id]);
    // console.log(resultAddToCart, ">>>>>>>>>> RESULT ADD TO CART");

    return resultAddToCart;
  } catch (error) {
    console.log(error);
    throw new Error(error.message || error);
  }
};

const editQuantityonCartServices = async (data) => {
  const { id } = data.user;
  const { productId, quantity } = data.body;
  // console.log(data.user, ">>>>>>>>> ID USER");
  // console.log(data.body, ">>>>>>>>> BODY");
  let sql, conn;
  try {
    conn = dbCon.promise();

    sql = `UPDATE cart SET qty = ? WHERE user_id = ? AND product_id = ?`;

    let [updateQuantity] = await conn.query(sql, [quantity, id, productId]);
    // console.log(updateQuantity);

    sql = `SELECT * FROM cart WHERE user_id = ?`;

    let [resultQuantity] = await conn.query(sql, [id]);

    return resultQuantity;
  } catch (error) {
    console.log(error);
    throw new Error(error.message || error);
  }
};

const deleteProductCartServices = async (data, user) => {
  // const { id } = data.user;
  console.log(data, ">>>>>>>>>>>>> DATA USERRRRRR");
  let sql, conn;
  try {
    conn = await dbCon.promise().getConnection();

    sql = `DELETE FROM cart WHERE user_id = ? AND id = ?`;
    let [deleteProduct] = await conn.query(sql, [user, data]);

    sql = `SELECT * FROM cart WHERE user_id = ?`;

    let [resultProductLeft] = await conn.query(sql, [user]);
    // console.log(deleteProduct);
    return resultProductLeft;
  } catch (error) {
    console.log(error);
    throw new Error(error.message || error);
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

const paymentPhotoService = async (req, res) => {
  let path = "/payment";
  let pathAva = "/payment-photo";
  const data = JSON.parse(req.body.data);
  const { payment_photo } = req.files;
  const imagePathAva = payment_photo
    ? `${path}${pathAva}/${payment_photo[0].filename}`
    : null;

  if (imagePathAva) {
    data.payment_photo = imagePathAva;
  }

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
    // sql = `SELECT id FROM users WHERE username = ?`;
    // let [usernameFound] = await conn.query(sql, data.username);
    // // error jika tidak unique
    // if (usernameFound.length && usernameFound[0].id !== id) {
    //   throw {
    //     message: "Username has already been used! Try a different one!",
    //   };
    // }
    sql = `UPDATE users JOIN user_details ON (users.id = user_details.user_id) SET ? WHERE users.id = ?`;
    await conn.query(sql, [data, id]);

    if (imagePathAva && result[0].payment_photo) {
      fs.unlinkSync(`./public${result[0].payment_photo}`);
    }

    sql = `SELECT * FROM users JOIN user_details ON (users.id = user_details.user_id) WHERE users.id = ?`;
    let [result1] = await conn.query(sql, id);
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

const getUserOrdersService = async (data) => {
  const { status } = data.params;
  let { terms, sinceDate, toDate, page, limit, order } = data.query;
  console.log(data.query);
  page = parseInt(page);
  limit = parseInt(limit);
  console.log({ page, limit });
  let offset = limit * page;
  let sql, conn;
  try {
    conn = dbCon.promise();
    sql = `SELECT COUNT(id) as total FROM orders  
      ${terms ? `AND name LIKE "%${terms}%"` : ""}`;
    let [resultTotal] = await conn.query(sql);
    console.log(resultTotal);
    let total = resultTotal[0].total;
    sql = `SELECT o.id, o.selected_address, o.payment_method, o.status, o.total_price, o.date_process, o.date_requested, o.prescription_photo, o.payment_method, o.shipping_method, o.user_id, o.transaction_code, u.username FROM orders o JOIN users u ON (o.user_id = u.id) WHERE o.id > 0 
    ${status === "all" ? "" : `AND o.status = "${status}"`} 
    ${
      terms
        ? `AND (u.username LIKE "%${terms}%" OR o.transaction_code LIKE "%${terms}%")`
        : ""
    } 
    ${sinceDate ? `AND o.date_process >= "${sinceDate}"` : ""}
    ${toDate ? `AND o.date_process <= "${toDate}"` : ""}
  ${order} LIMIT ?, ?`;
    let [orders] = await conn.query(sql, [offset, limit]);
    let responseData = { orders, total };
    return responseData;
  } catch (error) {
    throw new Error(error.message || error);
  }
};

module.exports = {
  getPrimaryAddressService,
  getAllAddressesService,
  addToCartServices,
  getCartServices,
  editQuantityonCartServices,
  deleteProductCartServices,
  paymentPhotoService,
  rejectOrderService,
  confirmOrderService,
  getAllTransactionService,
  uploadReceipeService,
  getUserOrdersService,
};
