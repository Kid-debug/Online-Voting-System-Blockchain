const { check } = require("express-validator");

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
];
