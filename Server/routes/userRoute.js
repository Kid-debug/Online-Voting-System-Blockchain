const express = require("express");
const router = express.Router();
const {
  signUpValidation,
  loginValidation,
  forgetValidation,
  changePasswordValidation,
  createCategoryValidation,
} = require("../helpers/validation");
const userController = require("../controllers/userController");
const categoryController = require("../controllers/categoryController");

//registration
router.post("/registerUser", signUpValidation, userController.registerUser);
router.post("/registerAdmin", signUpValidation, userController.registerAdmin);

router.post("/login", loginValidation, userController.login);
router.get("/logout", userController.logout);

//forgot password
router.post(
  "/forget-password",
  forgetValidation,
  userController.forgetPassword
);

router.post(
  "/change-password",
  changePasswordValidation,
  userController.changePassword
);

//category
router.post(
  "/createCategory",
  createCategoryValidation,
  categoryController.addCategory
);

router.get("/retrieveCategory", categoryController.retrieveCategory);

module.exports = router;
