const express = require("express");
const user_route = express.Router();

const { resetValidation } = require("../helpers/validation");
const userController = require("../controllers/userController");

// const checkResetToken = require("../middleware/checkResetToken");

// Define the GET route for mail verification
user_route.get("/mail-verification", userController.verifyMail);

// Define the POST route for resending verification email
// user_route.post(
//   "/resend-verification-email",
//   userController.resendVerificationMail
// );

user_route.get("/reset-password", userController.resetPasswordLoad);
user_route.post(
  "/reset-password",
  resetValidation,
  userController.resetPassword
);

// Export the configured router
module.exports = user_route;
