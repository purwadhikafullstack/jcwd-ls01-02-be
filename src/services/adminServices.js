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

module.exports = { adminLoginService };
