const { dbCon } = require("../connection");

const fetchProductsService = async (data) => {
  // let { page } = data.query;
  let limit = 24;
  let page = 0;
  // page = parseInt(page);
  let offset = limit * page;
  let conn, sql;
  try {
    conn = dbCon.promise();
    sql =
      "SELECT id, name, price, photo, promo, stock, category FROM products WHERE stock > 0 ORDER BY name LIMIT ?, ?";
    let [dataProducts] = await conn.query(sql, [offset, limit]);
    return dataProducts;
  } catch (error) {
    console.log(error);
    throw new Error(error.message || error);
  }
};

const fetchProductDetailsService = async (data) => {
  const { id } = data.params;
  let conn, sql;
  try {
    conn = dbCon.promise();
    sql =
      "SELECT p.id, p.name, p.price, p.photo, p.promo, p.stock, p.category, pd.indikasi, pd.komposisi, pd.kemasan, pd.golongan, pd.cara_penyimpanan, pd.principal, pd.NIE, pd.cara_pakai, pd.peringatan FROM products p JOIN product_details pd ON (p.id = pd.product_id) WHERE id = ?";
    let [dataDetails] = await conn.query(sql, id);
    return dataDetails;
  } catch (error) {
    console.log(error);
    throw new Error(error.message || error);
  }
};

// --- Filter Product by Name and Category --- //
const filterProductService = async (data) => {
  let name = data;
  // let category = data;
  let conn, sql;

  try {
    conn = await dbCon.promise().getConnection();
    if (name) {
      sql = `SELECT * FROM products WHERE name LIKE "%${name}%"`;

      let [filterName] = await conn.query(sql);

      return filterName;
    }
    // else if (name && category) {
    //   sql = `SELECT * FROM products WHERE name LIKE "%${name}%" AND category LIKE "%${category}%"`;

    //   let [filterCategory] = await conn.query(sql);

    //   return filterCategory;
    // }
  } catch (error) {
    throw new Error(error.message || error);
  }
};

module.exports = {
  fetchProductsService,
  fetchProductDetailsService,
  filterProductService,
};
