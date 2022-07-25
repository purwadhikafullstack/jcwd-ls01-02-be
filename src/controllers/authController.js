const { dbCon } = require("../connection");

const {
  newDataToken,
  newCache,
  createJWTEmail,
  linkGenerator,
  emailGenerator,
  createJWTAccess,
  hashPassword,
} = require("../lib");
const {
  registerService,
  keepLoginService,
  verificationService,
  loginService,
  profilePictureService,
  forgotPasswordService,
  changePasswordService,
} = require("../services");

const registerController = async (req, res) => {
  try {
    // calling register service for  data validation and data insertion to database
    const data = await registerService(req);

    // creating dataToken for token encryption
    const dataToken = newDataToken(data);

    // caching the token for validating the newest token requested
    newCache(dataToken);

    //  creating email token to be embedded to an activation link
    const tokenEmail = createJWTEmail(dataToken);

    // creating an activation link to be sent on a verification email
    const link = linkGenerator(tokenEmail, 1);

    // third parameter is the email type, verification = true, forget password = false
    await emailGenerator(data, link, true);

    const tokenAccess = createJWTAccess(dataToken);
    res.set("x-token-access", tokenAccess);
    return res.status(200).send({
      success: true,
      message: "User berhasil didaftarkan",
      data,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

const keepLoginController = async (req, res) => {
  try {
    let data = await keepLoginService(req.user);
    return res.status(200).send({
      success: true,
      message: "User berhasil log in",
      data,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

const emailVerificationController = async (req, res) => {
  try {
    const data = req.body;
    const dataToken = newDataToken(data);

    newCache(dataToken);

    const tokenEmail = createJWTEmail(dataToken);

    const link = linkGenerator(tokenEmail, 1);

    await emailGenerator(data, link, true);

    return res.status(200).send({
      success: true,
      message: "Email verifikasi terkirim",
      data,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: 500,
      success: false,
      message: error.message,
    });
  }
};

const verificationController = async (req, res) => {
  try {
    const data = await verificationService(req);
    return res.status(200).send({
      success: true,
      message: "User berhasil diverifikasi",
      data,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

const loginController = async (req, res) => {
  try {
    const data = await loginService(req);

    const dataToken = newDataToken(data);
    if (!data.verified) {
      newCache(dataToken);
      const tokenEmail = createJWTEmail(dataToken);
      const link = linkGenerator(tokenEmail, 1);
      await emailGenerator(data, link, "verification");
    }
    const tokenAccess = createJWTAccess(dataToken);
    res.set("x-token-access", tokenAccess);
    return res.status(200).send({
      success: true,
      message: "User berhasil log in",
      data,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

// Forgot/Reset Password
const forgotPasswordController = async (req, res) => {
  try {
    const data = await forgotPasswordService(req);
    const dataToken = newDataToken(data);
    newCache(dataToken);
    const tokenEmail = createJWTEmail(dataToken);
    const link = linkGenerator(tokenEmail, 0);
    await emailGenerator(data, link, false);
    return res.status(200).send({
      success: true,
      message: "Email reset password telah terkirim",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

const tokenPasswordController = async (req, res) => {
  try {
    return res.status(200).send({
      success: true,
      message: "Token berhasil tervalidasi",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

const changePassword = async (req, res) => {
  try {
    await changePasswordService(req);

    return res
      .status(200)
      .send({ success: 200, message: "Password telah terganti" });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

const profilePictureController = async (req, res) => {
  try {
    const data = await profilePictureService(req.body);
    return res.status(200).send(data);
  } catch (error) {
    conn.release();
    return res.status(500).send({ message: error.message });
  }
};

const resetPasswordController = async (req, res) => {
  const { id } = req.user;
  const { password } = req.body;
  let sql, conn;

  try {
    conn = await dbCon.promise().getConnection();
    let updateData = {
      password: await hashPassword(password),
    };
    sql = `UPDATE users SET ? WHERE id = ?`;
    await conn.query(sql, [updateData, id]);
    conn.release();
    return res.status(200).send({ message: "Password Changed ✅ " });
  } catch (error) {
    conn.release();
    return res.status(500).send({ message: error.message });
  }
};

module.exports = {
  registerController,
  keepLoginController,
  emailVerificationController,
  verificationController,
  loginController,
  forgotPasswordController,
  tokenPasswordController,
  changePassword,
  profilePictureController,
  resetPasswordController,
};
