const { adminLoginService } = require("../services");

const loginAdminController = async (req, res) => {
  try {
    const data = await adminLoginService(req.body);

    return res.status(200).send(data);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: error.message });
  }
};

const newProduct = async (req, res) => {
  const data = req.body;
  console.log(data);
  let conn, sql;
  try {
    conn = await dbCon.promise().getConnection();
    sql = `INSERT INTO products SET ?`;
    await conn.query(sql, data);
    // sql timeline petugas nambah produk
    conn.release();
    return res.status(200).send("success");
  } catch (error) {
    conn.release();
    console.log(error);
    return res.status(500).send("fail");
  }
};

module.exports = { loginAdminController, newProduct };
