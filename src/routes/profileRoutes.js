const express = require("express");
const {
  updateProfile,
  getUserDetails,
  addNewAddressController,
  changePrimaryAddressController,
  editAddressController,
  getPrimaryAddressController,
  getAllAddressesController,
} = require("../controllers");
const { verifyToken, upload } = require("../lib");
const Router = express.Router();

const uploader = upload("/profile-photos", "PROFILE").fields([
  { name: "profile_picture", maxCount: 1 },
]);

Router.patch("/profile-update", verifyToken, uploader, updateProfile);
Router.get("/user", getUserDetails);
Router.post("/new-address", verifyToken, addNewAddressController);
Router.patch("/edit-address", verifyToken, editAddressController);
Router.patch(
  "/change-primary-address",
  verifyToken,
  changePrimaryAddressController
);
Router.get("/primary-address", verifyToken, getPrimaryAddressController);
Router.get("/all-addresses", verifyToken, getAllAddressesController);

module.exports = Router;
