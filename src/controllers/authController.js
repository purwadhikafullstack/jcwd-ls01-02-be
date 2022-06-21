const {
  newDataToken,
  newCache,
  createJWTEmail,
  linkGenerator,
  emailGenerator,
  createJWTAccess,
} = require("../lib");
const { registerService } = require("../services");

const registerController = async (req, res) => {
  try {
    // calling register service for  data validation and data insertion to database
    const data = await registerService(req.body);

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
    return res.status(200).send({ message: "success" });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: error.message });
  }
};

const keepLoginController = async (req, res) => {
  try {
  } catch (error) {}
};
module.exports = { registerController };
