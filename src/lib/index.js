const { transporter, emailGenerator } = require("./emailGenerator");
const { hashPassword, hashMatch } = require("./hashing");
const {
  newDataToken,
  newCache,
  createJWTEmail,
  createJWTAccess,
  verifyToken,
  verifyLastToken,
} = require("./jwt");
const { linkGenerator } = require("./link");

module.exports = {
  hashPassword,
  newDataToken,
  newCache,
  createJWTEmail,
  createJWTAccess,
  linkGenerator,
  emailGenerator,
  verifyToken,
  verifyLastToken,
  hashMatch,
};
