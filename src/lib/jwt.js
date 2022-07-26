const NodeCache = require("node-cache");
const jwt = require("jsonwebtoken");
const myCache = new NodeCache();

// newDataToken function : function yang digunakan untuk membuat data token yang baru, yang akan digunakan untuk membuat token
const newDataToken = (data) => {
  let createdAt = new Date().getTime();
  const { id, username } = data;
  return {
    id,
    username,
    createdAt,
  };
};

/* 
  newCache function : function yang digunakan untuk melakukan caching di server, 
  digunakan pada saat memverifikasi apabila token yang digunakan adalah token yang paling akhir di-request
*/
const newCache = (data) => {
  const { id } = data;
  const expirationTime = 600;
  myCache.set(id, data, expirationTime);
};

// createJWTEmail function : function yang digunakan untuk membuat jwt token verifikasi akun
const createJWTEmail = (data) =>
  jwt.sign(data, process.env.JWT_SECRET_EMAIL, { expiresIn: "10m" });

// createJWTAccess function : function yang digunakan untuk membuat jwt token akses login
const createJWTAccess = (data) =>
  jwt.sign(data, process.env.JWT_SECRET_ACCESS, { expiresIn: "6h" });

/*
  verifyToken function : function middleware yang digunakan untuk memverifikasi token sebelum request dapat lanjut ke proses selanjutnya
  pada token email/verification, token akan di-append dengan keyword verif yang mana akan menjadi sebagai berikut:
  res.headers.authorization : `${token} verif`
  untuk tokenAccess: token
  req.headers.authorization : token asdhugsadliugdsiad.dsikuahgdkuagdkagdiaus.asdhjkgdahsdgdahs
  keyword tersebut akan mengidentifikasikan password apa yang akan digunakan untuk memverifikasi token
  verifyToken merupakan middleware yang wajib digunakan apabila terjadi suatu perubahan data pada user atau hal yang memerlukan authorization, contohnya:
  keeplogin, verification user, changepassword, membuat order, dsb.
*/
const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization.split(" ");
  const token = authHeader[0];
  const verification = authHeader[1];
  const key = verification
    ? process.env.JWT_SECRET_EMAIL
    : process.env.JWT_SECRET_ACCESS;

  try {
    let decode = jwt.verify(token, key);
    req.user = decode;

    next();
  } catch (error) {
    console.log(error);
    return res.status(401).send({ message: "Token expired!" });
  }
};

// verifyLastToken function : function yang digunakan untuk memverifikasi apakah token yang digunakan merupakan token yang paling terakhir di-request oleh user
const verifyLastToken = async (req, res, next) => {
  const { createdAt, id } = req.user;
  let cache = myCache.get(id);
  //   if (createdAt === cache?.createdAt) {
  if (createdAt === cache.createdAt) {
    next();
  } else {
    return res.status(401).send({ message: "New token already requested!" });
  }
};

module.exports = {
  newDataToken,
  newCache,
  createJWTEmail,
  createJWTAccess,
  verifyToken,
  verifyLastToken,
};
