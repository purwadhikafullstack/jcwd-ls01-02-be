const mysql = require("mysql2");
const { Client } = require("ssh2");
require("dotenv").config();

const host = process.env.HOST;
const user = process.env.USER_NAME;
const password = process.env.PASSWORD;
const database = process.env.DATABASE;

const db = mysql.createPool({
  host,
  user,
  password,
  database,
  port: 3306,
  connectionLimit: 10,
  dateStrings: true,
});

db.getConnection((err, conn) => {
  if (err) {
    return console.log(err);
  }
  return console.log(`connected as id ${conn?.threadId}`);
});

module.exports = db;
