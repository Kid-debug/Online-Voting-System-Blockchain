const { check } = require("express-validator");
// const multer = require("multer");
// const path = require("path");

// // Set up multer for file uploads
// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage }).single("candidate_image");

exports.signUpValidation = [
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

exports.loginValidation = [
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
    .normalizeEmail({ gmail_remove_dots: true })
    .custom((email) => {
      if (!email.endsWith("@student.tarc.edu.my")) {
        throw new Error("•Email must be a @student.tarc.edu.my");
      }
      return true;
    }),
];

exports.resetValidation = [
  // Check if verification code is not empty
  check("code", "• Code is required").not().isEmpty(),

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

  // check(
  //   "email",
  //   "• Email must be a valid address and end with @student.tarc.edu.my"
  // )
  //   .optional({ checkFalsy: true })
  //   .isEmail()
  //   .custom((email) => {
  //     if (email && !email.endsWith("@student.tarc.edu.my")) {
  //       throw new Error("Email must be a @student.tarc.edu.my");
  //     }
  //     return true;
  //   }),
];

//add category
exports.categoryValidation = [
  check("category_name")
    .trim() // Trim leading and trailing whitespace
    .notEmpty()
    .withMessage("• Category name is required")
    .isString()
    .withMessage("• Category name must be a string")
    .isLength({ min: 1, max: 100 })
    .withMessage("• Category name must be between 1 and 100 characters")
    .matches(/^[A-Za-z\s]+$/)
    .withMessage(
      "• Category name can only contain alphabetic characters and spaces"
    ),
];

//add candidate
exports.candidateValidation = [
  check("candidate_name")
    .trim() // Trim leading and trailing whitespace
    .notEmpty()
    .withMessage("• Candidate name is required")
    .isString()
    .withMessage("• Candidate name must be a string")
    .isLength({ min: 1, max: 100 })
    .withMessage("• Candidate name must be between 1 and 100 characters")
    .matches(/^[A-Za-z\s]+$/)
    .withMessage(
      "• Candidate name can only contain alphabetic characters and spaces"
    ),
  check("student_id")
    .trim()
    .notEmpty()
    .withMessage("• Student ID of the candidate is required")
    .isString()
    .withMessage("• Student ID of the candidate must be a string")
    .isLength(10)
    .withMessage("• Student ID of the candidate must be exactly 10 characters")
    .matches(/^\d{2}[A-Za-z]{3}\d{5}$/)
    .withMessage("• Student ID must follow the format like 22WMR05500"),
  // Custom validation for the image field
  // check("candidate_image").custom((value, { req }) => {
  //   return new Promise((resolve, reject) => {
  //     upload(req, req, (err) => {
  //       if (err) {
  //         reject("Failed to upload image");
  //       } else if (
  //         !req.file ||
  //         !req.file.buffer ||
  //         req.file.buffer.length === 0
  //       ) {
  //         reject("Image file is required");
  //       } else {
  //         resolve();
  //       }
  //     });
  //   });
  // }),
  // // Validation for allowed file extensions
  // check("candidate_image").custom((value, { req }) => {
  //   const allowedExtensions = [".jpg", ".jpeg", ".png"];
  //   const ext = path.extname(req.file.originalname).toLowerCase();

  //   if (!allowedExtensions.includes(ext)) {
  //     throw new Error(
  //       "Invalid file extension. Allowed extensions are .jpg, .jpeg, and .png"
  //     );
  //   }

  //   return true;
  // }),
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
