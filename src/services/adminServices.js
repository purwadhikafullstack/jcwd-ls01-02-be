const { dbCon } = require("../connection");
const {
  productCodeGenerator,
  photoNameGenerator,
  expireDateGenerator,
  dropEventGenerator,
  expireEventGenerator,
} = require("../lib/codeGenerator");
const { imageProcess } = require("../lib/upload");

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
  const parsedData = JSON.parse(data.body.data);
  let {
    name,
    NIE,
    category,
    golongan,
    tgl_kadaluarsa,
    indikasi,
    komposisi,
    cara_penyimpanan,
    principal,
    cara_pakai,
    peringatan,
    stock,
    satuan,
    kemasan,
    price,
    modal,
    promo,
    berat,
  } = parsedData;

  const dataPhoto = photoNameGenerator(data.file, "/products", "PRODUCT");

  let conn, sql;
  try {
    conn = await dbCon.promise().getConnection();
    await conn.beginTransaction();

    let dataProduct = {
      name,
      price,
      photo: dataPhoto.photo,
      promo,
      category,
      berat,
      satuan,
      golongan,
    };
    sql = `INSERT INTO products SET ?`;
    let [resultProduct] = await conn.query(sql, dataProduct);
    let product_id = resultProduct.insertId;

    let insertData = {
      no_produk: productCodeGenerator(category, golongan, product_id),
    };
    sql = `UPDATE products SET ? WHERE id = ?`;
    await conn.query(sql, [insertData, product_id]);

    let dataProductDetails = {
      indikasi,
      komposisi,
      kemasan,
      cara_penyimpanan,
      principal,
      NIE,
      cara_pakai,
      peringatan,
      modal,
      product_id,
    };
    sql = `INSERT INTO product_details SET ?`;
    await conn.query(sql, dataProductDetails);

    insertData = {
      admin_id: 4,
      aktivitas: 1,
      masuk: stock,
      sisa: Number(stock),
      product_id,
    };
    sql = `INSERT INTO admin_logger SET ?`;
    await conn.query(sql, insertData);

    insertData = {
      product_id,
      tgl_kadaluarsa,
      stock,
    };
    sql = `INSERT INTO product_stock SET ?`;
    await conn.query(sql, insertData);

    await imageProcess(data.file, dataPhoto.path);

    await conn.commit();
    conn.release();
    return { message: "success" };
  } catch (error) {
    await conn.rollback();
    conn.release();
    throw new Error(error.message || error);
  }
};

const editProductService = async (data) => {
  const parsedData = JSON.parse(data.body.data);
  let {
    name,
    NIE,
    category,
    golongan,
    indikasi,
    komposisi,
    cara_penyimpanan,
    principal,
    cara_pakai,
    peringatan,
    satuan,
    kemasan,
    price,
    modal,
    promo,
    berat,
    id,
  } = parsedData;
  let dataPhoto;
  if (data.file) {
    dataPhoto = photoNameGenerator(data.file, "/products", "PRODUCT");
  }

  let conn, sql;
  try {
    conn = await dbCon.promise().getConnection();
    await conn.beginTransaction();

    let dataProduct = {
      name,
      price,
      promo,
      category,
      berat,
      satuan,
      golongan,
    };
    sql = `UPDATE products SET ? WHERE id = ?`;
    await conn.query(sql, [dataProduct, id]);

    let dataProductDetails = {
      indikasi,
      komposisi,
      kemasan,
      cara_penyimpanan,
      principal,
      NIE,
      cara_pakai,
      peringatan,
      modal,
    };
    sql = `UPDATE product_details SET ? WHERE product_id = ?`;
    await conn.query(sql, [dataProductDetails, id]);

    if (dataPhoto) {
      let insertPhoto = { photo: dataPhoto.photo };
      sql = `UPDATE products SET ? WHERE id = ?`;
      await conn.query(sql, [insertPhoto, id]);
      await imageProcess(data.file, dataPhoto.path);
    }

    await conn.commit();
    conn.release();
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
  let offset = limit * page;
  let conn, sql;
  try {
    conn = dbCon.promise();
    sql = `SELECT DISTINCT p.id, p.name, p.price, p.promo, p.satuan, p.golongan, (SELECT SUM(ps1.stock) as total FROM product_stock ps1 WHERE ps1.product_id = p.id) as stock FROM products p JOIN product_stock ps ON (p.id = ps.product_id) WHERE (p.id > 0 AND name LIKE "%${terms}%" ${
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
  let { terms, sinceDate, toDate, page, limit, order } = data.query;
  page = parseInt(page);
  limit = parseInt(limit);
  let offset = limit * page;
  let sql, conn;
  try {
    conn = dbCon.promise();
    sql = `SELECT COUNT(o.id) as total FROM orders o join users u ON (o.user_id = u.id) WHERE o.id > 0 
    ${status === "all" ? "" : `AND o.status = "${status}"`} 
    ${
      terms
        ? `AND (u.username LIKE "%${terms}%" OR o.transaction_code LIKE "%${terms}%")`
        : ""
    } 
    ${sinceDate ? `AND o.date_requested >= "${sinceDate}"` : ""}
    ${toDate ? `AND o.date_requested <= "${toDate}"` : ""}`;
    let [resultTotal] = await conn.query(sql);
    let total = resultTotal[0].total;
    sql = `SELECT o.id, o.selected_address, o.payment_method, o.expired_at, o.status, o.total_price, o.date_process, o.date_requested, o.prescription_photo, o.payment_method, o.shipping_method, o.user_id, o.transaction_code, u.username FROM orders o JOIN users u ON (o.user_id = u.id) WHERE o.id > 0 
    ${status === "all" ? "" : `AND o.status = "${status}"`} 
    ${
      terms
        ? `AND (u.username LIKE "%${terms}%" OR o.transaction_code LIKE "%${terms}%")`
        : ""
    } 
    ${sinceDate ? `AND o.date_requested >= "${sinceDate}"` : ""}
    ${toDate ? `AND o.date_requested <= "${toDate}"` : ""}
    ${order} LIMIT ?, ?`;
    let [orders] = await conn.query(sql, [offset, limit]);

    let responseData = { orders, total };
    return responseData;
  } catch (error) {
    console.log(error);
    throw new Error(error.message || error);
  }
};

const validPrescriptionService = async (data) => {
  const { cart_checkout, namaDokter, namaPasien, id, dosis } = data.body;
  const statusPrev = 1;
  const status = 2;

  let sql, conn, insertData, mysql;
  try {
    conn = await dbCon.promise().getConnection();
    await conn.beginTransaction();

    sql = `UPDATE orders SET ? WHERE id = ?`;
    insertData = {
      status,
      expired_at: expireDateGenerator(),
    };
    await conn.query(sql, [insertData, id]);
    sql = `INSERT INTO order_prescription SET ?`;
    insertData = {
      order_id: id,
      nama_pasien: namaPasien,
      nama_dokter: namaDokter,
      dosis,
    };
    await conn.query(sql, insertData);

    let checkoutCart = [];
    for (const cart of cart_checkout) {
      sql = `SELECT stock, id FROM product_stock WHERE product_id = ? AND stock > 0`;
      let [stock] = await conn.query(sql, cart.id);
      let { qty } = cart;
      for (let i = 0; qty > 0; i++) {
        let qtyInit = qty;
        qty -= stock[i].stock;
        if (qty > 0) {
          insertData = {
            product_id: cart.id,
            qty: stock[i].stock,
            order_id: id,
            stock_id: stock[i].id,
            price: cart.price,
          };
          sql = `UPDATE product_stock SET stock = 0 WHERE id = ?`;
          await conn.query(sql, stock[i].id);
          checkoutCart.push(insertData);
        } else {
          insertData = {
            product_id: cart.id,
            qty: qtyInit,
            order_id: id,
            stock_id: stock[i].id,
            price: cart.price,
          };
          sql = `UPDATE product_stock SET stock = stock - ${qtyInit} WHERE id = ?`;
          await conn.query(sql, stock[i].id);
          checkoutCart.push(insertData);
        }
        sql = `INSERT INTO checkout_cart SET ?`;
        await conn.query(sql, insertData);
      }
    }

    let sqls = dropEventGenerator(statusPrev, id);
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

const getProductsService = async (data) => {
  let { terms, category, golongan, page, limit, order } = data.query;
  page = parseInt(page);
  limit = parseInt(limit);

  let offset = limit * page;
  let conn, sql;
  try {
    conn = dbCon.promise();
    sql = `SELECT COUNT(id) as total FROM products WHERE (id > 0 
      ${terms ? `AND name LIKE "%${terms}%"` : ""} 
      ${category === "all" ? "" : `AND category = "${category}"`} 
      ${golongan === "all" ? "" : `AND golongan = "${golongan}"`})`;
    let [resultTotal] = await conn.query(sql);

    let total = resultTotal[0].total;

    sql = `SELECT DISTINCT p.id, p.name, p.price, p.category, p.satuan, p.golongan, p.no_produk, pd.NIE, pd.modal, (SELECT SUM(ps1.stock) FROM product_stock ps1 WHERE ps1.product_id = p.id) as stock
    FROM products p JOIN product_details pd ON (p.id = pd.product_id) JOIN product_stock ps ON (p.id = ps.product_id) WHERE (p.id > 0 
      ${terms === "" ? "" : `AND name LIKE "%${terms}%"`}
      ${category === "all" ? "" : `AND category = "${category}"`} 
      ${golongan === "all" ? "" : `AND golongan = "${golongan}"`}) 
      ${order} LIMIT ?, ?`;
    let [dataProducts] = await conn.query(sql, [offset, limit]);
    let responseData = {
      products: dataProducts,
      total,
    };

    return responseData;
  } catch (error) {
    throw new Error(error.message || error);
  }
};

const getProductDetailsService = async (data) => {
  const { id } = data.query;
  let conn, sql;
  try {
    conn = dbCon.promise();

    sql = `SELECT p.name, p.price, p.photo, p.promo, (SELECT SUM(ps1.stock) FROM product_stock ps1 WHERE ps1.product_id = p.id) as stock , p.category, p.berat, p.satuan, p.golongan, p.no_produk, pd.indikasi, pd.komposisi, pd.kemasan, pd.cara_penyimpanan, pd.principal, pd.NIE, pd.cara_pakai, pd.peringatan, pd.product_id, pd.tgl_kadaluarsa, pd.modal FROM products p JOIN product_details pd ON (p.id = pd.product_id) JOIN product_stock ps ON (p.id = ps.product_id) WHERE p.id = ?`;
    let [result] = await conn.query(sql, id);

    return result[0];
  } catch (error) {
    throw new Error(error.message || error);
  }
};

const deleteProductService = async (data) => {
  let conn, sql;
  try {
    conn = await dbCon.promise().getConnection();
    sql = `DELETE FROM products where id = ${data.query.id}`;
    await conn.query(sql);
    sql = `SELECT * from products`;
    let result = await conn.query(sql);
    console.log(result);
    return result;
  } catch (error) {
    console.log(error);
    throw new Error(error.message || error);
  }
};

const getReportService = async (data) => {
  let { terms, page, limit, order, sinceDate, toDate } = data.query;
  page = parseInt(page);
  limit = parseInt(limit);
  let offset = limit * page;
  let conn, sql;
  try {
    conn = dbCon.promise();
    sql = `SELECT COUNT(id) as total FROM sales_report
    ${terms ? `AND name LIKE "%${terms}%"` : ""}`;
    let [resultTotal] = await conn.query(sql);
    let total = resultTotal[0].total;
    sql = `SELECT * from sales_report 
    ${sinceDate ? `AND sales_report.date >= "${sinceDate}"` : ""}
    ${toDate ? `AND sales_report.date <= "${toDate}"` : ""}
    ${terms === "" ? "" : `AND name LIKE "%${terms}%"`}
    ${order} LIMIT ?,?`;
    let [report] = await conn.query(sql, [offset, limit]);
    let responseData = { report, total };
    return responseData;
  } catch (error) {
    throw new Error(error.message || error);
  }
};

const getNameService = async (data) => {
  const { id } = data.query;
  let sql, conn;
  try {
    conn = dbCon.promise();
    sql = `SELECT name, no_produk FROM products WHERE id = ?`;
    let [result] = await conn.query(sql, id);

    return result[0];
  } catch (error) {
    throw new Error(error.message || error);
  }
};

const addStockService = async (data) => {
  const { product_id, stock, tgl_kadaluarsa } = data.body;
  let conn, sql, insertData;
  let id = 4;
  try {
    conn = await dbCon.promise().getConnection();
    await conn.beginTransaction();

    sql = `SELECT SUM(stock) as total FROM product_stock WHERE product_id = ?`;
    let [totalResult] = await conn.query(sql, product_id);
    let total = totalResult[0].total;
    insertData = {
      admin_id: id,
      aktivitas: 1,
      masuk: stock,
      sisa: Number(total) + Number(stock),
      product_id,
    };
    sql = `INSERT INTO admin_logger SET ?`;
    await conn.query(sql, insertData);

    insertData = {
      product_id,
      tgl_kadaluarsa,
      stock,
    };
    sql = `INSERT INTO product_stock SET ?`;
    await conn.query(sql, insertData);

    await conn.commit();
    conn.release();
  } catch (error) {
    console.log(error);
    await conn.rollback();
    conn.release();
    throw new Error(error.message || error);
  }
};

const getProductStockService = async (data) => {
  const { product_id } = data.body;
  let { page, limit, order } = data.query;
  page = parseInt(page);
  limit = parseInt(limit);
  let offset = limit * page;
  let conn, sql;
  try {
    conn = dbCon.promise();
    sql = `SELECT COUNT(id) as total FROM admin_logger WHERE product_id > 0`;
    // sql = `SELECT COUNT(id) as total FROM admin_logger where product_id = `;
    let [resultTotal] = await conn.query(sql, product_id);
    let total = resultTotal[0].total;
    sql = `SELECT l.id, l.aktivitas, l.keluar, l.masuk, l.sisa, l.product_id, l.created_at, a.username as petugas FROM admin_logger l JOIN admin a ON (l.admin_id = a.id ) WHERE l.admin_id > 0
    ${order} LIMIT ?,?`;
    let [productStock] = await conn.query(sql, [offset, limit]);
    let responseData = { productStock, total };
    // console.log(responseData);
    return responseData;
  } catch (error) {
    throw new Error(error.message || error);
  }
};

module.exports = {
  adminLoginService,
  newProductService,
  filterProductsService,
  getOrdersService,
  validPrescriptionService,
  getProductsService,
  getProductDetailsService,
  editProductService,
  deleteProductService,
  getReportService,
  addStockService,
  getNameService,
  getProductStockService,
};
