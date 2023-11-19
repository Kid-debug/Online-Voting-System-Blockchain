// File: middleware/checkResetToken.js

const ResetPassword = require("../models/reset_passwords");

const checkResetToken = async (req, res, next) => {
  const { token } = req.query;

  try {
    const tokenExists = await ResetPassword.findOne({ where: { token } });

    if (!tokenExists) {
      // Render an error page with a custom message
      return res
        .status(404)
        .render("404", { message: "Invalid or Expired Token." });
    }

    next();
  } catch (error) {
    console.error("Error in checkResetToken:", error);
    // Render the error page for other errors as well
    res.status(500).render("error-page", { message: "An error occurred." });
  }
};

module.exports = checkResetToken;
