const express = require("express");
const router = express.Router();
const {
  signUpUserValidation,
  signUpAdminValidation,
  loginValidation,
  forgetValidation,
  changePasswordValidation,
  feedbackValidation,
  updateFeedbackValidation,
} = require("../helpers/validation");
const userController = require("../controllers/userController");
const feedbackController = require("../controllers/feedbackController");

//registration
router.post("/registerUser", signUpUserValidation, userController.registerUser);
router.post("/verifyEmail", userController.sendEmail);
router.post(
  "/registerAdmin",
  signUpAdminValidation,
  userController.registerAdmin
);

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

//change user status
router.post("/sendEmailByBanned", userController.sendEmailByBanned);
router.post("/sendEmailByUnBanned", userController.sendEmailByUnBanned);

//feedback (user)
router.post(
  "/submitFeedback",
  feedbackValidation,
  feedbackController.submitFeedback
);

router.get("/getUserFeedback", feedbackController.getFeedbackByUserId);
router.put(
  "/editUserFeedback/:feedbackId",
  feedbackValidation,
  feedbackController.editUserFeedback
);

//feedback (admin)
router.get("/retrieveFeedback", feedbackController.retrieveFeedback);
router.get("/retrieveFeedback/:feedbackId", feedbackController.getFeedbackById);
router.put(
  "/updateFeedback/:feedbackId",
  updateFeedbackValidation,
  feedbackController.updateFeedback
);
router.delete("/deleteFeedback/:feedbackId", feedbackController.deleteFeedback);

module.exports = router;
