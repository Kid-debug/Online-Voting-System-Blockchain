const express = require("express");
const user_route = express.Router();

const { resetValidation } = require("../helpers/validation");
const userController = require("../controllers/userController");

const checkResetToken = require("../middleware/checkResetToken");

// Define the GET route for mail verification
user_route.get("/mail-verification", userController.verifyMail);

// Define the POST route for resending verification email
user_route.post(
  "/resend-verification-email",
  userController.resendVerificationMail
);

<<<<<<< HEAD
user_route.get("/refresh", userController.handleRefreshToken);

=======
>>>>>>> ba75df34aeaaefc52b8bbc4c45b1cdcd0f6e1fd9
user_route.get(
  "/reset-password",
  checkResetToken,
  userController.resetPasswordLoad
);
user_route.post(
  "/reset-password",
  resetValidation,
  userController.resetPassword
);

// Export the configured router
module.exports = user_route;
