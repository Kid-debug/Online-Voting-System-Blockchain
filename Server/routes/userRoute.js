const express = require("express");
const router = express.Router();
const {
  signUpValidation,
  loginValidation,
  forgetValidation,
} = require("../helpers/validation");
const userController = require("../controllers/userController");

router.post("/registerUser", signUpValidation, userController.registerUser);
router.post("/registerAdmin", signUpValidation, userController.registerAdmin);

router.post("/login", loginValidation, userController.login);
router.get("/logout", userController.logout);
router.post("/forget-password", forgetValidation, userController.forgetPassword);



module.exports = router;
