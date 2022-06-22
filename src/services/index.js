const {
  registerService,
  keepLoginService,
  verificationService,
} = require("./authServices");
const { adminLoginService } = require("./adminServices");
module.exports = {
  registerService,
  keepLoginService,
  verificationService,
  adminLoginService,
};
