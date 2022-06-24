const { dbCon } = require("../connection");

const adminLoginService = async (data) => {
  let { username, email, password } = data;
  let conn, sql;

  try {
    conn = dbCon.promise();

    sql = `select * from admin where (username = ? or email = ?) and password = ?`;
    let [result] = await conn.query(sql, [username, email, password]);
    if (!result.length) {
      throw "Admin not found";
    }
    return { data: result[0] };
  } catch (error) {
    console.log(error);
    throw new Error(error || "Network Error");
  }
};

module.exports = { adminLoginService };
