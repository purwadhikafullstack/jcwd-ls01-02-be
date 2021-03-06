const { dbCon } = require("../connection");

const fetchProductsService = async (data) => {
  let { order, page, limit } = data.query;
  console.log(page);
  page = parseInt(page);
  limit = parseInt(limit);
  let offset = limit * page;
  let conn, sql;
  const { category } = data.params;
  console.log(data.params);
  try {
    conn = dbCon.promise();
    sql = `SELECT COUNT(id) as total FROM products WHERE (stock > 0 ${
      category === "semua" ? "" : `AND category = "${category}"`
    })`;
    let [resultTotal] = await conn.query(sql);
    let total = resultTotal[0].total;
    sql = `SELECT id, name, price, photo, promo, stock, category FROM products WHERE (stock > 0 ${
      category === "semua" ? "" : `AND category = "${category}"`
    }) ${order} LIMIT ?, ?`;
    let [dataProducts] = await conn.query(sql, [offset, limit]);
    dataProducts = dataProducts.map((val) => {
      let initPrice = val.promo + val.price;
      val.promo = Math.round((val.promo / val.price) * 100);
      return { ...val, initPrice, total };
    });

    return dataProducts;
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
      "SELECT p.id, p.name, p.price, p.photo, p.promo, p.stock, p.category, pd.indikasi, pd.komposisi, pd.kemasan, pd.golongan, pd.cara_penyimpanan, pd.principal, pd.NIE, pd.cara_pakai, pd.peringatan, pd.satuan, pd.cara_pakai FROM products p JOIN product_details pd ON (p.id = pd.product_id) WHERE p.name = ?";
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
    sql = `SELECT id, name, price, photo, promo, stock, category, promo/price*100 as percent FROM products ORDER BY percent DESC LIMIT 10`;
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

module.exports = {
  fetchProductsService,
  fetchProductDetailsService,
  fetchPromoProductsService,
  filterProductService,
};
