const { default: axios } = require("axios");
const { dbCon } = require("../connection");

const fetchProvincesService = async () => {
  let sql, conn;
  try {
    conn = dbCon.promise();
    sql = `SELECT id, province FROM provinces`;
    let [resProvince] = await conn.query(sql);
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
    return resCity;
  } catch (error) {
    console.log(error);
    throw new Error((error.message = "Something went wrong :("));
  }
};

const fetchCostService = async (data) => {
  let { origin, destination, weight, courier } = data.body;
  try {
    let res = await axios.post(
      "https://api.rajaongkir.com/starter/cost",
      {
        origin,
        destination,
        weight,
        courier,
      },
      {
        headers: { key: process.env.API_KEY },
      }
    );
    let { costs } = res.data.rajaongkir.results[0];
    const delivery = costs.map((val) => {
      courier = courier.toUpperCase();
      courier = courier === "POS" ? `${courier} Indonesia` : courier;
      return {
        kurir: courier,
        jenis: val.service,
        harga: val.cost[0].value,
        durasi: val.cost[0].etd.split(" ")[0],
      };
    });
    return delivery;
  } catch (error) {
    console.log(error.data);
    throw new Error(error);
  }
};
module.exports = {
  fetchProvincesService,
  fetchCitiesService,
  fetchCostService,
};
