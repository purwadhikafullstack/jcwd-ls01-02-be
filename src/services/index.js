const {
  registerService,
  keepLoginService,
  verificationService,
  loginService,
} = require("./authServices");
const { adminLoginService } = require("./adminServices");
module.exports = {
  registerService,
  keepLoginService,
  verificationService,
  adminLoginService,
  loginService
};
