const { dbCon } = require("../connection");

const fetchProductsService = async (data) => {
  // let { page } = data.query;
  let limit = 24;
  let page = 0;
  // page = parseInt(page);
  let offset = limit * page;
  let conn, sql;
  const { order } = data.query;
  const { category } = data.params;
  console.log(data.params);
  console.log(category);
  try {
    conn = dbCon.promise();
    sql = `SELECT id, name, price, photo, promo, stock, category FROM products WHERE (stock > 0 ${
      category === "semua" ? "" : `AND category = "${category}"`
    }) ${order} LIMIT ?, ?`;
    let [dataProducts] = await conn.query(sql, [offset, limit]);
    dataProducts = dataProducts.map((val) => {
      let initPrice = val.promo + val.price;
      val.promo = Math.round((val.promo / val.price) * 100);
      return { ...val, initPrice };
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
  console.log(`"${product_name}"`);
  try {
    conn = dbCon.promise();
    sql =
      "SELECT p.id, p.name, p.price, p.photo, p.promo, p.stock, p.category, pd.indikasi, pd.komposisi, pd.kemasan, pd.golongan, pd.cara_penyimpanan, pd.principal, pd.NIE, pd.cara_pakai, pd.peringatan, pd.satuan, pd.dosis, pd.perhatian, pd.efek_samping, pd.cara_pakai FROM products p JOIN product_details pd ON (p.id = pd.product_id) WHERE p.name = ?";
    let [dataDetails] = await conn.query(sql, product_name);
    if (!dataDetails.length) {
      throw { message: "no product found" };
    }
    console.log(dataDetails);
    dataDetails = dataDetails[0];
    console.log(dataDetails);
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

module.exports = { fetchProductsService, fetchProductDetailsService };
