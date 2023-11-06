const express = require("express");
const user_route = express.Router();

const userController = require("../controllers/userController");

// Define the GET route for mail verification
user_route.get("/mail-verification", userController.verifyMail);

// Define the POST route for resending verification email
user_route.post(
  "/resend-verification-email",
  userController.resendVerificationMail
);

// Export the configured router
module.exports = user_route;
