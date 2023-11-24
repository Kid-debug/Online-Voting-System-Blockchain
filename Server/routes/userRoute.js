const express = require("express");
const router = express.Router();
const {
  signUpValidation,
  loginValidation,
  forgetValidation,
  changePasswordValidation,
} = require("../helpers/validation");
const userController = require("../controllers/userController");

router.post("/registerUser", signUpValidation, userController.registerUser);
router.post("/registerAdmin", signUpValidation, userController.registerAdmin);

router.post(
  "/forget-password",
  forgetValidation,
  userController.forgetPassword
);
// router.post(
//   "/change-password",
//   changePasswordValidation,
//   userController.changePassword
// );

module.exports = router;
