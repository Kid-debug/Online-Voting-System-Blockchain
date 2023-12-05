// userController.js
const User = require("../models/user");
const ResetPassword = require("../models/reset_passwords");
const sequelize = require("../config/sequelize");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET;
const { promisify } = require("util");
const jwtVerify = promisify(jwt.verify);
const randomstring = require("randomstring");
const sendMail = require("../helpers/sendMail.js");

const registerUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const emailLower = req.body.email.toLowerCase();
    // Check if the user already exists
    const existingUser = await User.findOne({
      where: { email: emailLower },
    });

    if (existingUser) {
      return res.status(409).json({ msg: "This email is already registered." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // Generate a verification token
    const randomToken = randomstring.generate();

    // Create the new user with hashed password, role, and token
    const newUser = await User.create({
      email: emailLower,
      password: hashedPassword,
      role: "U", //User Role
      token: randomToken,
      token_created_at: new Date(), // Sets token_created_at to NOW()
    });

    // Send the verification email
    const mailSubject = "Mail Verification";
    const content =
      "<p>Hi there,</p>" +
      "<p>We've received a verification request for " +
      req.body.email +
      ". Please verify your email below.</p>" +
      "<p><a href='http://localhost:3000/mail-verification?token=" +
      randomToken +
      "' style='background-color: darkblue; color: white; padding: 10px; text-decoration: none; display: inline-block;'>Verify Email</a></p>" +
      "<p>Can't see the button? Copy and paste this link into your browser:</p>" +
      "<p><a href='http://localhost:3000/mail-verification?token=" +
      randomToken +
      "'>http://localhost:3000/mail-verification?token=" +
      randomToken +
      "</a></p>" +
      "<p>Please be reminded that the verification token is only valid for 24 hours</p>" +
      "<p>If you did not request for register email verification, please ignore this email.</p>" +
      "<p>Thank you.</p>";
    await sendMail(newUser.email, mailSubject, content);

    return res.status(201).json({
      msg: "Congratulations, you registered with us successfully! Please verify your email to proceed login!",
    });
  } catch (err) {
    console.error(err);
    // If hashing fails or any other error occurs
    return res.status(400).json({ msg: err });
  }
};

const registerAdmin = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const emailLower = req.body.email.toLowerCase();
    // Check if the user already exists
    const existingUser = await User.findOne({
      where: { email: emailLower },
    });

    if (existingUser) {
      return res.status(409).json({ msg: "This email is already registered." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // Generate a verification token
    const randomToken = randomstring.generate();

    // Create the new user with hashed password, role, and token
    const newUser = await User.create({
      email: emailLower,
      password: hashedPassword,
      role: "A", //Admin Role
      token: randomToken,
      token_created_at: new Date(), // Sets token_created_at to NOW()
    });

    // Send the verification email
    const mailSubject = "Mail Verification (Online Voting System)";
    const content =
      "<p>Hi there,</p>\n" +
      "<p>We've received a verification request for " +
      req.body.email +
      ". Please verify your email below.</p>\n" +
      "<p><a href='http://localhost:3000/mail-verification?token=" +
      randomToken +
      "' style='background-color: darkblue; color: white; padding: 10px; text-decoration: none; display: inline-block;'>Verify Email</a></p>\n" +
      "<p>Can't see the button? Copy and paste this link into your browser:</p>\n" +
      "<p><a href='http://localhost:3000/mail-verification?token=" +
      randomToken +
      "'>http://localhost:3000/mail-verification?token=" +
      randomToken +
      "</a></p>\n" +
      "<p>Please be reminded that the verification token is only valid for 24 hours</p>\n" +
      "<p>If you did not request for register email verification, please ignore this email.</p>\n" +
      "<p>Thank you.</p>" +
      "<br><br><br>" +
      "<p>[This is a computer generated message which requires no signature.]</p><br>" +
      "<p>*** THIS IS AN AUTO GENERATED EMAIL NOTIFICATION. PLEASE DO NOT REPLY. ***</p>";
    await sendMail(newUser.email, mailSubject, content);

    return res.status(201).json({
      msg: "Congratulations, you registered with us successfully! Please verify your email to proceed login!",
    });
  } catch (err) {
    console.error(err);
    // If hashing fails or any other error occurs
    return res.status(400).json({ msg: err });
  }
};

const verifyMail = async (req, res) => {
  const token = req.query.token;

  try {
    // Update token_updated_at with the current time
    const updateResult = await User.update(
      { token_updated_at: sequelize.fn("NOW") },
      { where: { token: token } }
    );

    if (updateResult[0] < 1) {
      // Token not found or already used
      return res
        .status(404)
        .render("404", { message: "Token not found or already used" });
    }

    // Retrieve the user to check the token_created_at
    const user = await User.findOne({ where: { token: token } });

    if (!user) {
      return res.status(500).render("error-page", {
        message: "An error occurred while verifying the email.",
      });
    }

    const tokenCreatedAt = new Date(user.token_created_at);
    const tokenUpdatedAt = new Date(user.token_updated_at);
    const tokenAgeSeconds = (tokenUpdatedAt - tokenCreatedAt) / 1000;

    const expirationTimeSeconds = 24 * 60 * 60; // 24 hours in seconds

    // Check if the token is expired
    if (tokenAgeSeconds > expirationTimeSeconds) {
      return res.status(400).render("link-expired", {
        userEmail: user.email,
        message:
          "Your verification link has expired. Please request a new one.",
      });
    }

    // Token is valid, proceed to update the user as verified
    await User.update(
      {
        token: null,
        token_created_at: null,
        token_updated_at: null,
        is_verified: 1,
      },
      { where: { user_id: user.user_id } }
    );

    // Verification successful
    return res.status(200).render("mail-verification", {
      message:
        "Email verification successful. You now can go to the login page to continue login process.",
    });
  } catch (error) {
    console.error(error);
    // Handle errors during the process
    return res.status(500).render("error-page", {
      message: "An error occurred while updating the user status.",
    });
  }
};

const resendVerificationMail = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(404).render("404", { message: "No email provided" });
  }

  try {
    // Check if the user exists, is not verified, and the cooldown has passed
    const user = await User.findOne({
      where: {
        email: sequelize.where(
          sequelize.fn("LOWER", sequelize.col("email")),
          sequelize.fn("LOWER", email)
        ),
        is_verified: 0,
      },
    });

    if (!user) {
      return res.status(404).render("404", {
        message: "User does not exist or is already verified.",
      });
    }

    const timeElapsed = new Date() - new Date(user.token_created_at);
    const waitTime = 15 * 60 * 1000; // 15 minutes in milliseconds

    if (timeElapsed < waitTime) {
      const timeToWait = waitTime - timeElapsed;
      const minutesToWait = Math.ceil(timeToWait / 60000); // Convert milliseconds to minutes and round up
      // Render the page with the message instead of sending JSON
      return res.render("link-expired", {
        userEmail: email,
        message: `Please wait ${minutesToWait} more minute(s) before requesting a new verification email.`,
      });
    }

    // Generate a new token
    const newToken = randomstring.generate();

    // Update the user with the new token and timestamp
    await User.update(
      {
        token: newToken,
        token_created_at: sequelize.fn("NOW"), // Set the token_created_at to the current time
        token_updated_at: null, // Set the token_updated_at to null
      },
      {
        where: {
          email: sequelize.where(
            sequelize.fn("LOWER", sequelize.col("email")),
            sequelize.fn("LOWER", email)
          ),
        },
      }
    );

    // Send verification email with the new token
    let mailSubject = "Resent Mail Verification (Online Voting System)";
    let content =
      "<p>Hi there,</p>\n" +
      "<p>We've received a verification request for " +
      req.body.email +
      ". Please verify your email below.</p>\n" +
      "<p><a href='http://localhost:3000/mail-verification?token=" +
      newToken +
      "' style='background-color: darkblue; color: white; padding: 10px; text-decoration: none; display: inline-block;'>Verify Email</a></p>\n" +
      "<p>Can't see the button? Copy and paste this link into your browser:</p>\n" +
      "<p><a href='http://localhost:3000/mail-verification?token=" +
      newToken +
      "'>http://localhost:3000/mail-verification?token=" +
      newToken +
      "</a></p>\n" +
      "<p>Please be reminded that the verification token is only valid for 24 hours</p>\n" +
      "<p>If you did not request for register email verification, please ignore this email.</p>\n" +
      "<p>Thank you.</p>" +
      "<br><br><br>" +
      "<p>[This is a computer generated message which requires no signature.]</p><br>" +
      "<p>*** THIS IS AN AUTO GENERATED EMAIL NOTIFICATION. PLEASE DO NOT REPLY. ***</p>";

    await sendMail(email, mailSubject, content);

    return res.status(200).render("mail-verification", {
      message:
        "Verification email resent successfully. Please check your email to verify your account!",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).render("error-page", {
      message: "Error updating user with new token",
    });
  }
};

const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const user = await User.findOne({ where: { email: req.body.email } });

    if (user) {
      const match = await bcrypt.compare(req.body.password, user.password);

      if (match) {
        req.session.email = user.email;
        req.session.role = user.role;
        req.session.user_id = user.user_id;
        let path = user.role === "U" ? "voterdashboard" : "admin/home";

        if (req.body.rememberMe) {
          // Extend session cookie's lifetime for 30 days
          req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days
        } else {
          // If Remember Me isn't checked, set a shorter session duration (24 hours)
          req.session.cookie.maxAge = 24 * 60 * 60 * 1000; // 24 hours
        }

        const sessionExpiryTime = Date.now() + req.session.cookie.maxAge;
        return res.status(200).send({
          path,
          userRole: req.session.role,
          email: req.session.email,
          userId: req.session.user_id,
          sessionExpiryTime,
        });
      } else {
        return res.status(401).json({ msg: "Password is incorrect." });
      }
    } else {
      return res.status(401).json({ msg: "Email does not exist." });
    }
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).send({ msg: "Internal server error" });
  }
};

const logout = async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send({ msg: "Logout failed", error: err });
    }
    res.clearCookie("userId");
    return res.status(200).send({ msg: "Logged out" });
  });
};

function generateVerificationCode(length) {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters.charAt(randomIndex);
  }

  return code;
}

const forgetPassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });

    if (user) {
      // Find the most recent reset password entry for the email
      const resetEntry = await ResetPassword.findOne({
        where: { email: email },
        order: [["created_at", "DESC"]],
      });

      // Check if the entry exists and is within the last 15 minutes
      if (resetEntry) {
        const timeSinceLastReset = new Date() - new Date(resetEntry.created_at);
        if (timeSinceLastReset < 15 * 60 * 1000) {
          return res.status(429).json({
            msg: "A reset link has already been sent recently. Please wait for 15 minutes before requesting a new one.",
          });
        }
      }

      // Generate a token with a 24 hours expiration
      const token = jwt.sign({ email: email }, JWT_SECRET, {
        expiresIn: "1d",
      });

      const verificationCode = generateVerificationCode(10);
      console.log(verificationCode);

      // Prepare the email content
      const content = `
        <p>We heard that you lost your password.</p>\n
        <p>Don't worry. Please click the following link and enter the following code to change your password:</p>\n
        <p><a href='http://localhost:3000/reset-password?token=${token}'>http://localhost:3000/reset-password?token=${token}</a></p>\n
        <p>Code:${verificationCode}</p>\n
        <p>Please be reminded that the code is valid for 24 hours</p>\n
        <p>If you did not request for password reset, please ignore this email.</p>\n
        <p>Thank you.</p>\n
        <br><br><br>
        <p>[This is a computer generated message which requires no signature.]</p><br>
        <p>*** THIS IS AN AUTO GENERATED EMAIL NOTIFICATION. PLEASE DO NOT REPLY. ***</p>
      `;

      // Send the password reset email
      await sendMail(email, "Forget Password (Online Voting System)", content);

      // Destroy any existing reset password entries for the email
      await ResetPassword.destroy({ where: { email: email } });

      // Create a new reset password entry
      await ResetPassword.create({
        email: email,
        token: token,
        verification_code: verificationCode,
        created_at: new Date(),
      });

      return res
        .status(200)
        .json({ msg: "Email Sent Successfully for Reset Password" });
    } else {
      return res.status(401).json({ msg: "Email does not exist." });
    }
  } catch (error) {
    console.error("Error in forgetPassword:", error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

const resetPasswordLoad = async (req, res) => {
  try {
    // Set headers to prevent caching of this page
    res.set("Cache-Control", "no-cache, no-store, must-revalidate");
    res.set("Pragma", "no-cache");
    res.set("Expires", "0");
    var token = req.query.token;
    if (!token) {
      return res.render("404");
    }

    // Verify if the token has expired
    try {
      await jwtVerify(token, process.env.JWT_SECRET);
    } catch (error) {
      // If there's an error, it could mean the token has expired
      return res.render("reset-expired", {
        message: "Your reset link has expired or is invalid.",
      });
    }

    const resetPasswordEntry = await ResetPassword.findOne({
      where: { token: token },
    });

    if (resetPasswordEntry) {
      // Add a check for the created_at timestamp is exceeded 24 hours or not
      const createdAt = resetPasswordEntry.created_at;
      const expiryDate = new Date(createdAt.getTime() + 24 * 60 * 60 * 1000);
      if (new Date() > expiryDate) {
        return res.render("reset-expired", {
          message: "Your reset link has expired.",
        });
      }

      const user = await User.findOne({
        where: { email: resetPasswordEntry.email },
      });

      if (user) {
        return res.render("reset-password", {
          user: user,
          error_messages: [],
          token: token,
        });
      } else {
        return res.render("404");
      }
    } else {
      return res.render("404");
    }
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .render("error-page", { message: "An error occurred." });
  }
};

const resetPassword = async (req, res) => {
  const errors = validationResult(req);

  // It's better to use session or cookies to store these if possible
  const userId = req.body.id || req.query.id;
  const userEmail = req.body.email || req.query.email;
  const userToken = req.body.token || req.query.token;
  const verificationCode = req.body.code || req.query.code;

  // Prepare the context for rendering the page
  const context = {
    error_messages: [],
    user: { user_id: userId, email: userEmail },
    token: userToken,
  };

  if (!errors.isEmpty()) {
    context.error_messages = errors.array();
    return res.render("reset-password", context);
  } else {
    try {
      const resetPasswordEntry = await ResetPassword.findOne({
        where: { token: userToken },
      });

      if (!resetPasswordEntry) {
        context.error_messages.push({ msg: "Invalid or expired token." });
        return res.render("reset-password", context);
      }

      // Check if the verification code is invalid
      if (resetPasswordEntry.verification_code !== verificationCode) {
        context.error_messages.push({
          msg: "Invalid verification code.",
        });
        return res.render("reset-password", context);
      }

      const currentUser = await User.findByPk(userId);
      if (!currentUser) {
        context.error_messages.push({ msg: "User not found." });
        return res.render("reset-password", context);
      }

      const currentHashedPassword = currentUser.password;
      const isSamePassword = await bcrypt.compare(
        req.body.password,
        currentHashedPassword
      );
      if (isSamePassword) {
        context.error_messages.push({
          msg: "You are using an old password. Please set a new password!",
        });
        return res.render("reset-password", context);
      }

      // Proceed with resetting the password
      const newHashedPassword = await bcrypt.hash(req.body.password, 10);
      const [updatedRows] = await User.update(
        { password: newHashedPassword },
        { where: { user_id: userId } }
      );

      if (updatedRows > 0) {
        await ResetPassword.destroy({ where: { token: userToken } });
        context.success = true;
        return res.render("reset-password", context);
      } else {
        context.error_messages.push({
          msg: "Failed to update password. Please try again.",
        });
        return res.render("reset-password", context);
      }
    } catch (error) {
      console.error("Error in resetPassword:", error);
      context.error_messages.push({
        msg: "An error occurred while resetting your password.",
      });
      return res.render("reset-password", context);
    }
  }
};

const changePassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const token = req.headers.authorization?.split(" ")[1] || req.cookies.jwt;

  if (!token) {
    return res
      .status(401)
      .json({ msg: "No token provided, authorization denied." });
  }

  try {
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    const userEmail = decoded.email;

    const user = await User.findOne({ where: { email: userEmail } });
    if (user) {
      const { currentPassword, newPassword } = req.body;
      const isMatch = await bcrypt.compare(currentPassword, user.password);

      if (isMatch) {
        if (newPassword !== currentPassword) {
          const newHashedPassword = await bcrypt.hash(newPassword, 10);
          const [updatedRows] = await User.update(
            { password: newHashedPassword },
            { where: { email: userEmail } }
          );

          if (updatedRows > 0) {
            return res
              .status(201)
              .json({ msg: "Password successfully updated." });
          } else {
            return res.status(500).json({
              msg: "Failed to update password. Please try again.",
            });
          }
        } else {
          return res.status(400).json({
            msg: "New password must be different from the current password.",
          });
        }
      } else {
        return res.status(400).json({ msg: "Current password is incorrect." });
      }
    } else {
      return res.status(404).json({ msg: "User not found." });
    }
  } catch (error) {
    console.error("Error in changePassword:", error);
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ msg: "Token expired." });
    } else {
      return res.status(401).json({ msg: "Invalid token." });
    }
  }
};

module.exports = {
  registerUser,
  registerAdmin,
  verifyMail,
  resendVerificationMail,
  login,
  logout,
  forgetPassword,
  resetPasswordLoad,
  resetPassword,
  changePassword,
};
