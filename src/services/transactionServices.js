const { dbCon } = require("../connection");
const db = require("../connection/mysqldb");
const {
  dateGenerator,
  photoNameGenerator,
  codeGenerator,
  expireDateGenerator,
  expireEventGenerator,
  dropEventGenerator,
} = require("../lib/codeGenerator");
const { imageProcess } = require("../lib/upload");

const addToCartServices = async (data) => {
  const { id } = data.user;
  const { productId, quantity } = data.body;
  // console.log(data.user, ">>>>>>>>>>");
  // console.log(data.body, ">>>>>>>>>>BODYYYY");
  let sql, conn, result;

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
      await conn.query(sql, [productId, quantity, id]);

      // if (!resultInsertProduct) {
      //   throw { message: "Produk gagal ditambahkan" };
      // }
    } else {
      sql = `SELECT qty FROM cart WHERE user_id = ? AND product_id = ?`;

      let [quantityCart] = await conn.query(sql, [id, productId]);

      sql = `UPDATE cart SET qty = ? WHERE user_id = ? AND product_id = ?`;

      // console.log(quantityCart, ">>>>>>>>>>>QUANTITYY CARTTT");

      await conn.query(sql, [quantity + quantityCart[0].qty, id, productId]);
      // console.log(updateQuantity, ">>>>>>>>>>>>> UPDATE QUANTITY BERHASIL");
    }

    sql = `SELECT c.qty, p.id, p.name, p.price, p.promo, p.stock, p.photo, c.checkout FROM cart c JOIN products p ON (c.product_id = p.id) WHERE c.user_id = ?`;
    [result] = await conn.query(sql, id);
    result = result.map((val) => {
      return {
        ...val,
        checkout: val.checkout ? true : false,
      };
    });
    return { cart: result };
    sql = `SELECT * FROM cart WHERE user_id = ?`;

    let [resultAddtoCart] = await conn.query(sql, [id]);

    return { cart: resultAddtoCart };
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

    sql = `DELETE FROM cart WHERE user_id = ? AND product_id = ?`;
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
// bisa cancel tapi belum pakai dropevent
const rejectOrderService = async (data) => {
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
  const statusPrev = 4;
  const status = 5;
  const { transaction_code } = data.body;
  let sql, conn;
  try {
    conn = await dbCon.promise().getConnection();
    await conn.beginTransaction();
    sql = `SELECT id, status FROM orders where transaction_code = ?`;
    let [resultStatus] = await conn.query(sql, transaction_code);
    let { id } = resultStatus[0];

    if (resultStatus[0].status === "Dibatalkan") {
      throw { message: "Transaksi kamu sudah dibatalkan" };
    }
    sql = `UPDATE orders SET ? WHERE id = ?`;
    let insertData = {
      status,
      expired_at: expireDateGenerator(7),
    };
    await conn.query(sql, [insertData, id]);

    await conn.commit();
    conn.release();
  } catch (error) {
    await conn.rollback();
    conn.release();
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
    conn = await dbCon.promise().getConnection();
    await conn.beginTransaction();
    let date = dateGenerator();
    let insertData = {
      user_id: id,
      prescription_photo: dataPhoto.photo,
      status: 1,
      transaction_code: codeGenerator("RESEP", date, id),
      expired_at: expireDateGenerator(1),
    };
    sql = `INSERT INTO orders set ?`;
    let [result] = await conn.query(sql, insertData);

    let sqls = expireEventGenerator(1, [result.insertId]);
    console.log(sqls);
    for (const sql of sqls) {
      await conn.query(sql);
    }

    await imageProcess(data.file, dataPhoto.path);

    await conn.commit();
    conn.release();
    return { message: "succes" };
  } catch (error) {
    console.log(error);
    await conn.rollback();
    conn.release();
    throw new Error(error.message);
  }
};

const getUserOrdersService = async (data) => {
  const { status } = data.params;
  const { id } = data.user;
  let { terms, sinceDate, toDate, page, limit, order } = data.query;
  console.log(data.query);
  page = parseInt(page);
  limit = parseInt(limit);
  console.log({ page, limit });
  let offset = limit * page;
  let sql, conn;
  try {
    conn = dbCon.promise();
    sql = `SELECT COUNT(id) as total FROM orders WHERE user_id = ?`;
    let [resultTotal] = await conn.query(sql, id);
    console.log(resultTotal);
    let total = resultTotal[0].total;
    sql = `SELECT o.id, o.selected_address, o.payment_method, o.status, o.total_price, o.date_process, o.date_requested, o.prescription_photo, o.payment_method, o.shipping_method, o.user_id, o.transaction_code, u.username FROM orders o JOIN users u ON (o.user_id = u.id) WHERE user_id = ?
    ${status === "all" ? "" : `AND o.status = "${status}"`} 
    ${sinceDate ? `AND o.date_process >= "${sinceDate}"` : ""}
    ${toDate ? `AND o.date_process <= "${toDate}"` : ""}
  ${order} LIMIT ?, ?`;
    let [orders] = await conn.query(sql, [id, offset, limit]);
    let responseData = { orders, total };
    return responseData;
  } catch (error) {
    throw new Error(error.message || error);
  }
};

const getCartPrescriptionService = async (data) => {
  const { transaction_code } = data.query;
  const { id: user_id } = data.user;
  let sql, conn;
  try {
    conn = await dbCon.promise().getConnection();

    sql = `SELECT id, status FROM orders WHERE transaction_code = ? AND user_id = ?;`;
    let [resultId] = await conn.query(sql, [transaction_code, user_id]);
    if (!resultId.length) {
      throw { message: "Unauthorized User" };
    }
    if (resultId[0].status !== "Pesanan-Diterima") {
      throw { message: "Invalid Request" };
    }
    const { id, status } = resultId[0];

    sql = `SELECT stock_id, qty FROM checkout_cart WHERE qty > 0 AND order_id = ?;`;
    let [checkoutCart] = await conn.query(sql, id);

    sql = `SELECT DISTINCT cc.product_id, cc.price, p.photo, p.name, p.promo + cc.price as init_price, p.satuan, p.berat, (SELECT SUM(cc1.qty) FROM checkout_cart cc1 WHERE cc1.product_id = cc.product_id AND cc1.order_id = cc.order_id) as qty FROM checkout_cart cc JOIN products p ON (cc.product_id = p.id) WHERE cc.order_id = ?;`;
    let [cartData] = await conn.query(sql, id);
    let totalBerat = 0;
    for (const cart of cartData) {
      totalBerat += cart.qty * cart.berat;
    }
    conn.release();
    return { cartData, id, checkoutCart, status, totalBerat };
  } catch (error) {
    conn.release();
    throw new Error(error.message || error);
  }
};

const paymentMethodService = async (data) => {
  const {
    selected_address,
    payment_method,
    shipping_method,
    id,
    checkoutCart,
    total_price,
  } = data.body;
  console.log(data.body);
  const statusPrev = 2;
  const status = 3;

  let sql, conn;
  try {
    conn = await dbCon.promise().getConnection();

    sql = `SELECT status FROM orders Where id = ?`;
    let [resultStatus] = await conn.query(sql, id);

    if (resultStatus[0].status === "Dibatalkan") {
      throw { message: "Transaksi kamu sudah dibatalkan" };
    }

    sql = `UPDATE orders SET ? WHERE id = ?`;
    insertData = {
      status,
      expired_at: expireDateGenerator(),
      selected_address,
      payment_method,
      shipping_method,
      total_price,
    };
    await conn.query(sql, [insertData, id]);

    let sqls = dropEventGenerator(statusPrev, id, checkoutCart);
    for (const sql of sqls) {
      await conn.query(sql);
    }

    sqls = expireEventGenerator(status, id, checkoutCart);
    for (const sql of sqls) {
      await conn.query(sql);
    }

    await conn.commit();
    conn.release();
  } catch (error) {
    conn.rollback();
    conn.release();
    throw new Error(error.message || error);
  }
};

const uploadPaymentProofService = async (data) => {
  const parsedData = JSON.parse(data.body.data);
  const { id: user_id } = data.user;
  let { id, checkoutCart, transaction_code } = parsedData;
  const dataPhoto = photoNameGenerator(data.file, "/payment-photo", "PAYMENT");
  const statusPrev = 3;
  const status = 4;
  let conn, sql;
  try {
    conn = await dbCon.promise().getConnection();
    await conn.beginTransaction();

    sql = `SELECT status FROM orders Where id = ?`;
    let [resultStatus] = await conn.query(sql, id);

    if (resultStatus[0].status === "Dibatalkan") {
      throw { message: "Transaksi kamu sudah dibatalkan" };
    }

    sql = `SELECT id, status FROM orders WHERE transaction_code = ? AND user_id = ?;`;
    let [resultId] = await conn.query(sql, [transaction_code, user_id]);
    if (!resultId.length) {
      throw { message: "Unauthorized User" };
    }

    sql = `UPDATE orders SET ? WHERE id = ?`;
    let insertData = {
      status,
      payment_photo: dataPhoto.photo,
      expired_at: expireDateGenerator(),
    };
    await conn.query(sql, [insertData, id]);

    let sqls = dropEventGenerator(statusPrev, id, checkoutCart);
    for (const sql of sqls) {
      await conn.query(sql);
    }

    sqls = expireEventGenerator(status, id, checkoutCart);
    for (const sql of sqls) {
      await conn.query(sql);
    }
    await imageProcess(data.file, dataPhoto.path);
    await conn.commit();
    conn.release();
  } catch (error) {
    console.log(error);
    await conn.rollback();
    conn.release();
    throw new Error(error.message);
  }
};

const getOrderDetailsService = async (data) => {
  const { transaction_code } = data.query;
  const { id: user_id } = data.user;
  let sql, conn, finalData;
  try {
    conn = await dbCon.promise().getConnection();

    sql = `SELECT id, status, selected_address, payment_method, total_price, date_requested, date_process, prescription_photo, payment_photo, shipping_method, transaction_code, pesan, expired_at FROM orders WHERE transaction_code = ? AND user_id = ?;`;
    let [dataOrder] = await conn.query(sql, [transaction_code, user_id]);
    if (!dataOrder.length) {
      throw { message: "Unauthorized User" };
    }

    const { id, status } = dataOrder[0];
    finalData = { dataOrder: dataOrder[0] };
    if (status !== "Pengecekan-Resep") {
      sql = `SELECT DISTINCT cc.product_id, cc.price, p.photo, p.name, p.promo + cc.price as init_price, p.satuan, (SELECT SUM(cc1.qty) FROM checkout_cart cc1 WHERE cc1.product_id = cc.product_id AND cc1.order_id = cc.order_id) as qty FROM checkout_cart cc JOIN products p ON (cc.product_id = p.id) WHERE cc.order_id = ?;`;
      [cart] = await conn.query(sql, id);
      finalData = { ...finalData, cart };
      sql = `SELECT stock_id, qty FROM checkout_cart WHERE qty > 0 AND order_id = ?;`;
      let [checkoutCart] = await conn.query(sql, id);
      finalData = { ...finalData, checkoutCart };
    }

    conn.release();
    return finalData;
  } catch (error) {
    conn.release();
    throw new Error(error.message || error);
  }
};

const orderReceivedService = async (data) => {
  const status = 6;
  const { transaction_code } = data.body;
  let sql, conn;
  try {
    conn = await dbCon.promise().getConnection();
    await conn.beginTransaction();
    sql = `SELECT id, status FROM orders where transaction_code = ?`;
    let [resultStatus] = await conn.query(sql, transaction_code);
    let { id } = resultStatus[0];

    sql = `UPDATE orders SET ? WHERE id = ?`;
    let insertData = {
      status,
    };
    await conn.query(sql, [insertData, id]);

    await conn.commit();
    conn.release();
  } catch (error) {
    await conn.rollback();
    conn.release();
    console.log(error);
    throw new Error(error.message);
  }
};

module.exports = {
  getPrimaryAddressService,
  getAllAddressesService,
  addToCartServices,
  getCartServices,
  editQuantityonCartServices,
  deleteProductCartServices,
  rejectOrderService,
  confirmOrderService,
  getAllTransactionService,
  uploadReceipeService,
  getUserOrdersService,
  getCartPrescriptionService,
  paymentMethodService,
  uploadPaymentProofService,
  getOrderDetailsService,
  orderReceivedService,
};
