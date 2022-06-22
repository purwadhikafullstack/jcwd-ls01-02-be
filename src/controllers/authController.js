const {
  newDataToken,
  newCache,
  createJWTEmail,
  linkGenerator,
  emailGenerator,
  createJWTAccess,
} = require("../lib");
const {
  registerService,
  keepLoginService,
  verificationService,
  loginService,
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
    const link = linkGenerator(tokenEmail);

    // third parameter is the email type, verification = true, forget password = false
    await emailGenerator(data, link, true);

    const tokenAccess = createJWTAccess(dataToken);
    res.set("x-token-access", tokenAccess);
    return res.status(200).send(data);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: error.message });
  }
};

const keepLoginController = async (req, res) => {
  try {
    let data = await keepLoginService(req);
    return res.status(200).send(data);
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

const emailVerificationController = async (req, res) => {
  try {
    const data = req.body;
    const dataToken = newDataToken(data);
    //
    newCache(dataToken);

    const tokenEmail = createJWTEmail(dataToken);

    const link = linkGenerator(tokenEmail);

    await emailGenerator(data, link, true);

    return res
      .status(200)
      .send({ message: "e-mail verification has been sent" });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: error.message || error });
  }
};

const verificationController = async (req, res) => {
  try {
    const data = await verificationService(req);
    return res.status(200).send(data);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: error.message || error });
  }
};

const loginController = async (req, res) => {
  try {
    const data = await loginService(req.body);

    const dataToken = newDataToken(data);

    if (!data.verified) {
      const tokenEmail = createJWTEmail(dataToken);
      const link = linkGenerator(tokenEmail);
      await emailGenerator(data, link, "verification");
    }
    const tokenAccess = createJWTAccess(dataToken);
    res.set("x-token-access", tokenAccess);
    return res.status(200).send({ message: "Login Success ✅ " });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

module.exports = {
  registerController,
  keepLoginController,
  emailVerificationController,
  verificationController,
  loginController,
};
