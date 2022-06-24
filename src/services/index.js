const {
  registerService,
  keepLoginService,
  verificationService,
  loginService,
  changePasswordProfileService,
} = require("./authServices");
const { adminLoginService } = require("./adminServices");
module.exports = {
  registerService,
  keepLoginService,
  verificationService,
  adminLoginService,
  loginService,
  changePasswordProfileService,
};
