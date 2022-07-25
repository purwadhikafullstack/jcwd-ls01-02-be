const { dbCon } = require("../connection");

const fetchProductsService = async (data) => {
  let { order, page, limit } = data.query;
  page = parseInt(page);
  limit = parseInt(limit);
  let offset = limit * page;
  let conn, sql;
  const { category } = data.params;
  console.log(data.params);
  console.log(order);
  try {
    conn = dbCon.promise();
    sql = `SELECT COUNT(id) as total FROM products ${
      category === "semua" ? "" : `WHERE category = "${category}"`
    }`;
    let [resultTotal] = await conn.query(sql);
    let total = resultTotal[0].total;
    sql = `SELECT DISTINCT p.id, p.name, p.price, p.category, p.satuan, p.golongan, p.photo, p.promo, (SELECT SUM(ps1.stock) FROM product_stock ps1 WHERE ps1.product_id = p.id) as stock
    FROM products p JOIN product_stock ps ON (p.id = ps.product_id) ${
      category === "semua" ? "" : `WHERE  category = "${category}"`
    } ${order} LIMIT ?, ?`;

    let [dataProducts] = await conn.query(sql, [offset, limit]);

    dataProducts = dataProducts.map((val) => {
      let initPrice = val.promo + val.price;
      val.promo = Math.round((val.promo / val.price) * 100);
      return { ...val, initPrice };
    });
    let responseData = {
      products: dataProducts,
      total,
    };

    return responseData;
  } catch (error) {
    console.log(error);
    throw new Error(error.message || error);
  }
};

const fetchProductDetailsService = async (data) => {
  const { product_name } = data.params;
  let conn, sql;
  try {
    conn = dbCon.promise();
    sql =
      "SELECT p.id, p.name, p.price, p.photo, p.promo,  p.category, pd.indikasi, pd.komposisi, pd.kemasan, p.golongan, p.berat, pd.cara_penyimpanan, pd.principal, pd.NIE, pd.cara_pakai, pd.peringatan, p.satuan, pd.cara_pakai,(SELECT SUM(ps1.stock) FROM product_stock ps1 WHERE ps1.product_id = p.id) as stock FROM products p JOIN product_details pd ON (p.id = pd.product_id) JOIN product_stock ps ON (p.id = ps.product_id) WHERE p.name = ?";
    let [dataDetails] = await conn.query(sql, product_name);
    if (!dataDetails.length) {
      throw { message: "no product found" };
    }
    dataDetails = dataDetails[0];
    dataDetails = {
      ...dataDetails,
      initPrice: dataDetails.promo + dataDetails.price,
      promo: Math.round((dataDetails.promo / dataDetails.price) * 100),
    };
    return dataDetails;
  } catch (error) {
    console.log(error);
    throw new Error(error.message || error);
  }
};

const fetchPromoProductsService = async () => {
  let conn, sql;
  try {
    conn = dbCon.promise();
    sql = `SELECT p.id, p.name, p.price, p.photo, p.promo, (SELECT SUM(ps1.stock) FROM product_stock ps1 WHERE ps1.product_id = p.id) as stock, p.category, p.promo/p.price*100 as percent FROM products p JOIN product_stock ps ON (p.id = ps.product_id) ORDER BY percent DESC LIMIT 17`;
    let [resultPromo] = await conn.query(sql);
    resultPromo = resultPromo.map((val) => {
      let initPrice = val.promo + val.price;
      val.promo = Math.round((val.promo / val.price) * 100);
      return { ...val, initPrice };
    });
    return resultPromo;
  } catch (error) {
    console.log(error);
    throw new Error(error.message || error);
  }
};

const filterProductService = async (data) => {
  let { name, category } = data;
  let conn, sql;

  try {
    conn = await dbCon.promise().getConnection();

    sql = `SELECT * FROM products WHERE name LIKE "%${name}%" ${
      category == "all" ? "" : `AND category = "${category}"`
    }`;

    let [filterNameAndCategory] = await conn.query(sql);

    return filterNameAndCategory;
  } catch (error) {
    console.log(error);
    throw new Error(error.message || error);
  }
};

const deleteProductService = async (data) => {
  const { id } = data;
  let conn, sql;
  try {
    conn = await dbCon.promise().getConnection();
    sql = `SELECT id from products where id = ?`;
    let [haveProduct] = await conn.query(sql, id);
    if (!haveProduct.length) {
      throw "Product not found";
    }
    sql = `SELECT * FROM products where id = ? AND is_deleted = "?"`;
    let [alreadyDeletedProduct] = await conn.query(sql, [id, "YES"]);
    console.log(alreadyDeletedProduct[0]);
    if (alreadyDeletedProduct.length) {
      throw "Product already deleted!";
    }
    sql = `UPDATE products SET is_deleted = ? WHERE id = ?`;
    let [result] = await conn.query(sql, ["YES", id]);
    return { data: result };
  } catch (error) {
    console.log(error);
    throw new Error(error.message || error);
  } finally {
    conn.release();
  }
};

module.exports = {
  fetchProductsService,
  fetchProductDetailsService,
  fetchPromoProductsService,
  filterProductService,
  deleteProductService,
};
