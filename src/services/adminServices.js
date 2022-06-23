const { dbCon } = require("../connection");

const adminLoginService = async (data) => {
  let { username, email, password } = data;
  let conn, sql;

  try {
    conn = await dbCon.promise().getConnection();

    sql = `select * from admin where (username = ? or email = ?) and password = ?`;
    let [result] = await conn.query(sql, [username, email, password]);
    console.log(result);
    if (!result.length) {
      throw "Admin not found";
    }
    conn.release();
    return { success: true, data: result[0] };
  } catch (error) {
    conn.release();
    console.log(error);
    throw new Error(error || "Network Error");
  }
};

module.exports = { adminLoginService };
