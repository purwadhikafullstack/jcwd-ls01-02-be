const { dbCon } = require("../connection");

const fetchProvincesService = async () => {
  let sql, conn;
  try {
    conn = dbCon.promise();
    sql = `SELECT id, province FROM provinces`;
    let [resProvince] = await conn.query(sql);
    console.log(resProvince);
    return resProvince;
  } catch (error) {
    console.log(error);
    throw new Error((error.message = "Something went wrong :("));
  }
};

const fetchCitiesService = async (data) => {
  let { province_id } = data.query;
  province_id = parseInt(province_id);
  let sql, conn;
  try {
    conn = dbCon.promise();
    sql = `SELECT id, city, postal_code FROM cities WHERE province_id = ?`;
    let [resCity] = await conn.query(sql, province_id);
    console.log(resCity);
    return resCity;
  } catch (error) {
    console.log(error);
    throw new Error((error.message = "Something went wrong :("));
  }
};

module.exports = { fetchProvincesService, fetchCitiesService };
