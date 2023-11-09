const express = require("express");
const router = express.Router();
const { signUpValidation, loginValidation } = require("../helpers/validation");
const userController = require("../controllers/userController");

router.post("/registerUser", signUpValidation, userController.registerUser);
router.post("/registerAdmin", signUpValidation, userController.registerAdmin);

router.get("/get-user", userController.getUser);
router.post("/login", loginValidation, userController.login);
router.get("/logout", userController.logout);

module.exports = router;
