const express = require("express");
const adminRouter = express.Router();
const { signUpValidation } = require("../helpers/validation");
const userController = require("../controllers/userController");

adminRouter.post(
  "/registerAdmin",
  signUpValidation,
  userController.registerAdmin
);

module.exports = adminRouter;
