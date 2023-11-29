const express = require("express");
const router = express.Router();
const {
  signUpValidation,
<<<<<<< HEAD
  loginValidation,
=======
>>>>>>> ba75df34aeaaefc52b8bbc4c45b1cdcd0f6e1fd9
  forgetValidation,
  changePasswordValidation,
  createCategoryValidation,
} = require("../helpers/validation");
const userController = require("../controllers/userController");
const categoryController = require("../controllers/categoryController");

//registration
router.post("/registerUser", signUpValidation, userController.registerUser);
router.post("/registerAdmin", signUpValidation, userController.registerAdmin);

<<<<<<< HEAD
router.post("/login", loginValidation, userController.login);
router.get("/logout", userController.logout);

=======
>>>>>>> ba75df34aeaaefc52b8bbc4c45b1cdcd0f6e1fd9
//forgot password
router.post(
  "/forget-password",
  forgetValidation,
  userController.forgetPassword
);

<<<<<<< HEAD
router.post(
  "/change-password",
  changePasswordValidation,
  userController.changePassword
);
=======
// router.post(
//   "/change-password",
//   changePasswordValidation,
//   userController.changePassword
// );
>>>>>>> ba75df34aeaaefc52b8bbc4c45b1cdcd0f6e1fd9

//category
router.post(
  "/createCategory",
  createCategoryValidation,
  categoryController.addCategory
);

router.get("/retrieveCategory", categoryController.retrieveCategory);

module.exports = router;
