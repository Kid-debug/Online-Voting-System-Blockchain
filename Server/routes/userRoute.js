const express = require("express");
const router = express.Router();
const {
  signUpValidation,
  loginValidation,
  forgetValidation,
  changePasswordValidation,
  feedbackValidation,
  updateFeedbackValidation,
  categoryValidation,
} = require("../helpers/validation");
const userController = require("../controllers/userController");
const feedbackController = require("../controllers/feedbackController");
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

//category
router.post(
  "/createCategory",
  categoryValidation,
  categoryController.addCategory
);

router.get("/retrieveCategory", categoryController.retrieveCategory);
router.get("/retrieveCategory/:categoryId", categoryController.getCategoryById);
router.put(
  "/updateCategory/:categoryId",
  categoryValidation,
  categoryController.updateCategory
);
router.delete("/deleteCategory/:categoryId", categoryController.deleteCategory);

module.exports = router;
