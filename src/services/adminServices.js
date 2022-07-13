const { dbCon } = require("../connection");

const adminLoginService = async (data) => {
  let { username, email, password } = data;
  let conn, sql, result;

  try {
    conn = dbCon.promise();

    sql = `SELECT id, username, email FROM admin WHERE (username = ? OR email = ?) AND password = ?`;
    [result] = await conn.query(sql, [username, email, password]);

    if (!result.length) {
      throw { message: "Admin not found" };
    }
    return { data: result[0] };
  } catch (error) {
    console.log(error);
    throw new Error(error || "Network Error");
  }
};

const newProductService = async (data) => {
  let {
    name,
    price,
    photo,
    promo,
    category,
    stock,
    indikasi,
    komposisi,
    kemasan,
    golongan,
    cara_penyimpanan,
    principal,
    NIE,
    cara_pakai,
    peringatan,
    satuan,
    tgl_kadaluarsa,
    modal,
    berat,
  } = data.body;
  let conn, sql;
  try {
    conn = await dbCon.promise().getConnection();
    await conn.beginTransaction();

    let dataProduct = {
      name,
      price,
      photo,
      category,
      stock,
      promo,
    };
    sql = `INSERT INTO products SET ?`;
    let [resultProduct] = await conn.query(sql, dataProduct);
    console.log(resultProduct);
    console.log([resultProduct]);
    console.log(resultProduct.insertId);
    console.log([resultProduct.insertId]);

    let product_id = resultProduct.insertId;
    let dataProductDetails = {
      indikasi,
      komposisi,
      dosis,
      kemasan,
      golongan,
      cara_penyimpanan,
      principal,
      NIE,
      cara_pakai,
      peringatan,
      satuan,
      tgl_kadaluarsa,
      modal,
      perhatian,
      efek_samping,
      product_id,
    };
    sql = `INSERT INTO product_details SET ?`;
    await conn.query(sql, dataProductDetails);

    await conn.commit();
    conn.release();
    return { message: "success" };
  } catch (error) {
    await conn.rollback();
    conn.release();
    throw new Error(error.message || error);
  }
};

const filterProductsService = async (data) => {
  let { order, page, limit, terms, category } = data.query;
  page = parseInt(page);
  limit = parseInt(limit);
  console.log(order);
  let offset = limit * page;
  let conn, sql;
  try {
    conn = dbCon.promise();
    sql = `SELECT id, name, price, photo, promo, stock, category, berat, golongan, satuan FROM products WHERE (stock > 0 AND name LIKE "%${terms}%" ${
      category === "semua" ? "" : `AND category = "${category}"`
    }) ${order} LIMIT ?, ?`;

    let [products] = await conn.query(sql, [offset, limit]);

    return products;
  } catch (error) {
    throw new Error(error.message || error);
  }
};

const getOrdersService = async (data) => {
  const { status } = data.params;
  let sql, conn;
  try {
    conn = dbCon.promise();
    sql = `SELECT o.id, o.selected_address, o.payment_method, o.status, o.total_price, o.date_process, o.date_requested, o.prescription_photo, o.payment_method, o.shipping_method, o.user_id, o.transaction_code, u.username FROM orders o JOIN users u ON (o.user_id = u.id)  ${
      status === "all" ? "" : `WHERE o.status = "${status}"`
    }`;
    let [orders] = await conn.query(sql);
    return orders;
  } catch (error) {
    throw new Error(error.message || error);
  }
};

const validPrescriptionService = async (data) => {
  const { cartOrder, namaDokter, namaPasien } = data.body;
  console.log(data.body);
};

module.exports = {
  adminLoginService,
  newProductService,
  filterProductsService,
  getOrdersService,
  validPrescriptionService,
};
