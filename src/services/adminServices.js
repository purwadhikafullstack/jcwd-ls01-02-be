const { dbCon } = require("../connection");
const {
  productCodeGenerator,
  photoNameGenerator,
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
      stock,
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
      tgl_kadaluarsa,
      modal,
      product_id,
    };
    sql = `INSERT INTO product_details SET ?`;
    await conn.query(sql, dataProductDetails);

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
  console.log(data.body);
  console.log(data.file);
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
      tgl_kadaluarsa,
      modal,
    };
    sql = `UPDATE product_details SET ? WHERE product_id = ?`;
    await conn.query(sql, [dataProductDetails, id]);

    if (stock) {
      sql = `SELECT stock FROM products WHERE id = ?`;
      let [prevStock] = await conn.query(sql, id);
      console.log(prevStock);
      let insertStock = {
        stock: Number(stock) + Number(prevStock[0].stock),
      };
      console.log({ insertStock });
      sql = `UPDATE products SET ? WHERE id = ?`;
      await conn.query(sql, [insertStock, id]);
    }
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
  let { terms, sinceDate, toDate, page, limit, order } = data.query;
  // const { terms, sinceDate, toDate } = data.query;
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
    // let [orders] = await conn.query(sql);
    let [orders] = await conn.query(sql, [offset, limit]);
    let responseData = { orders, total };
    return responseData;
  } catch (error) {
    throw new Error(error.message || error);
  }
};

const validPrescriptionService = async (data) => {
  const { cart_checkout, namaDokter, namaPasien, id } = data.body;
  const status = 2;

  console.log(data.body);
  let sql, conn, insertData;
  try {
    conn = await dbCon.promise().getConnection();
    await conn.beginTransaction();

    sql = `UPDATE orders SET status = ? WHERE id = ?`;
    await conn.query(sql, [status, id]);

    sql = `INSERT INTO order_prescription SET ?`;
    insertData = {
      order_id: id,
      nama_pasien: namaPasien,
      nama_dokter: namaDokter,
    };
    await conn.query(sql, insertData);

    console.log(cart_checkout);
    insertData = cart_checkout.map((val) => {
      return {
        product_id: val.id,
        qty: val.qty,
        dosis: val.dosis,
        order_id: id,
      };
    });
    for (const data of insertData) {
      sql = `INSERT INTO checkout_cart SET ?`;
      await conn.query(sql, data);
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
  console.log(data.query);
  console.log(order);
  page = parseInt(page);
  limit = parseInt(limit);

  console.log({ page, limit, category, golongan });
  let offset = limit * page;
  let conn, sql;
  try {
    conn = dbCon.promise();
    sql = `SELECT COUNT(id) as total FROM products WHERE (stock > 0 
      ${terms ? `AND name LIKE "%${terms}%"` : ""} 
      ${category === "all" ? "" : `AND category = "${category}"`} 
      ${golongan === "all" ? "" : `AND golongan = "${golongan}"`})`;
    let [resultTotal] = await conn.query(sql);
    let total = resultTotal[0].total;
    sql = `SELECT p.id, p.name, p.price, p.stock, p.category, p.satuan, p.golongan, p.no_produk, pd.NIE, pd.modal FROM products p JOIN product_details pd ON (p.id = pd.product_id) WHERE (id > 0 
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

    sql = `SELECT p.name, p.price, p.photo, p.promo, p.stock, p.category, p.berat, p.satuan, p.golongan, p.no_produk, pd.indikasi, pd.komposisi, pd.kemasan, pd.cara_penyimpanan, pd.principal, pd.NIE, pd.cara_pakai, pd.peringatan, pd.product_id, pd.tgl_kadaluarsa, pd.modal FROM products p JOIN product_details pd ON (p.id = pd.product_id) WHERE p.id = ?`;
    let [result] = await conn.query(sql, id);

    return result[0];
  } catch (error) {
    throw new Error(error.message || error);
  }
};

const getReportService = async (data) => {
  let { page, limit } = data.query;
  console.log(data.query);
  page = parseInt(page);
  limit = parseInt(limit);
  let offset = limit * page;
  let conn, sql;
  try {
    conn = dbCon.promise();
    sql = `SELECT a.id, a.aktivitas, a.keluar, a.masuk, a.stock, a.tanggal `;
    let [result] = await conn.query(sql, [offset, limit]);
  } catch (error) {
    throw new Error(error.message || error);
  }
};

const deleteProductService = async (data) => {
  console.log(data.query);
  let conn, sql;
  try {
    conn = await dbCon.promise().getConnection();
    sql = `SELECT * from products where id = ?`;
    await conn.query(sql, [data.query.id]);
    sql = `DELETE FROM products where id = ${data.query.id}`;
    await conn.query(sql);
  } catch (error) {
    console.log(error);
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
};
