const { check } = require("express-validator");

exports.signUpUserValidation = [
  // Check if email is not empty and stop validation chain if empty
  check("email", "•Email is required")
    .not()
    .isEmpty()
    .bail() // Stops validation chain if email is empty
    .isEmail()
    .withMessage("•Please enter a valid email")
    .normalizeEmail({ gmail_remove_dots: true })
    .custom((email) => {
      if (!email.endsWith("@student.tarc.edu.my")) {
        throw new Error("•Email must be a @student.tarc.edu.my");
      }
      return true;
    }),

  // Check if password is not empty and stop validation chain if empty
  check("password", "•Password is required")
    .not()
    .isEmpty()
    .bail() // Stops validation chain if password is empty
    .isLength({ min: 8 })
    .withMessage("•Password must be at least 8 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/)
    .withMessage(
      "•Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character"
    ),

  // Check if confirm password is not empty and stop validation chain if empty
  check("confirmPassword", "•Confirm Password is required")
    .not()
    .isEmpty()
    .bail() // Stops validation chain if confirm password is empty
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error(
          "•Confirm Password field must have the same value as the password field"
        );
      }
      return true;
    }),
];

exports.signUpAdminValidation = [
  // Check if email is not empty and stop validation chain if empty
  check("email", "•Email is required")
    .not()
    .isEmpty()
    .bail() // Stops validation chain if email is empty
    .isEmail()
    .withMessage("•Please enter a valid email")
    .normalizeEmail({ gmail_remove_dots: false }), // Normalizes the email address

  // Check if password is not empty and stop validation chain if empty
  check("password", "•Password is required")
    .not()
    .isEmpty()
    .bail() // Stops validation chain if password is empty
    .isLength({ min: 8 })
    .withMessage("•Password must be at least 8 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/)
    .withMessage(
      "•Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character"
    ),

  // Check if confirm password is not empty and stop validation chain if empty
  check("confirmPassword", "•Confirm Password is required")
    .not()
    .isEmpty()
    .bail() // Stops validation chain if confirm password is empty
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error(
          "•Confirm Password field must have the same value as the password field"
        );
      }
      return true;
    }),
];

exports.loginValidation = [
  // Check if email is not empty and stop validation chain if empty
  check("email", "•Email is required")
    .not()
    .isEmpty()
    .bail() // Stops validation chain if email is empty
    .isEmail()
    .withMessage("•Please enter a valid email")
    .normalizeEmail({ gmail_remove_dots: true }),

  // Check if password is not empty and stop validation chain if empty
  check("password", "•Password is required").not().isEmpty(),
];

exports.forgetValidation = [
  // Check if email is not empty and stop validation chain if empty
  check("email", "•Email is required")
    .not()
    .isEmpty()
    .bail() // Stops validation chain if email is empty
    .isEmail()
    .withMessage("•Please enter a valid email")
    .normalizeEmail({ gmail_remove_dots: true }),
];

exports.resetValidation = [
  // Check if verification code is not empty
  check("verificationCode", "• Code is required").not().isEmpty(),

  // Check if password is not empty and stop validation chain if empty
  check("password", "• Password is required")
    .not()
    .isEmpty()
    .bail() // Stops validation chain if password is empty
    .isLength({ min: 8 })
    .withMessage("•Password must be at least 8 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/)
    .withMessage(
      "•Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character"
    ),

  // Check if confirm password is not empty and stop validation chain if empty
  check("confirmPassword", "• Confirm Password is required")
    .not()
    .isEmpty()
    .bail() // Stops validation chain if confirm password is empty
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error(
          "•Confirm Password field must have the same value as the password field"
        );
      }
      return true;
    }),
];

exports.changePasswordValidation = [
  // Validation chain for new password
  check("currentPassword", "• Current password is required").not().isEmpty(),
  // Check if password is not empty and stop validation chain if empty
  check("newPassword", "• Password is required")
    .not()
    .isEmpty()
    .bail() // Stops validation chain if password is empty
    .isLength({ min: 8 })
    .withMessage("• New Password must be at least 8 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/)
    .withMessage(
      "• New Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character"
    ),
  // Check if confirm password is not empty and stop validation chain if empty
  check("repeatNewPassword", "• Confirm New Password is required")
    .not()
    .isEmpty()
    .bail() // Stops validation chain if confirm password is empty
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error("• Confirm New Password must match New Password");
      }
      return true;
    }),
];

exports.feedbackValidation = [
  // Validate the emotion selection
  check(
    "selectedEmotion",
    "• Please select at least one emotion for your feedback"
  )
    .not()
    .isEmpty(),

  // Validate the feedback text
  check(
    "feedbackText",
    "• Feedback cannot be empty and must not exceed 300 characters"
  )
    .not()
    .isEmpty()
    .bail()
    .isLength({ max: 300 }),
];

exports.updateFeedbackValidation = [
  // Validate the status
  check("status", "• Status is required")
    .not()
    .isEmpty()
    .withMessage("• You must select a status")
    .isIn(["Under Review", "Mark As Reviewed"])
    .withMessage("• Invalid status selected"),
];
