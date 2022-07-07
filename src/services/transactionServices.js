const { dbCon } = require("../connection");

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

const deleteProductCartServices = async (data) => {
  const { id } = data.user;
  const { productId } = data.body;
  // console.log(data.user, ">>>>>>>>>>>>> DATA USERRRRRR");
  // console.log(data.body, ">>>>>>>>>>>>> DATA BOOOOOODDDDDYYYYYY");
  let sql, conn;
  try {
    conn = await dbCon.promise().getConnection();

    sql = `DELETE FROM cart WHERE user_id = ? AND product_id = ?`;
    let [deleteProduct] = await conn.query(sql, [id, productId]);

    sql = `SELECT * FROM cart WHERE user_id = ?`;

    let [resultProductLeft] = await conn.query(sql, [id]);
    // console.log(deleteProduct);
    return resultProductLeft;
  } catch (error) {
    console.log(error);
    throw new Error(error.message || error);
  }
};

module.exports = {
  addToCartServices,
  getCartServices,
  editQuantityonCartServices,
  deleteProductCartServices,
};
