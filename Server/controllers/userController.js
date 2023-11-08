// userController.js
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

const db = require("../config/dbConnection");

const randomstring = require("randomstring");
const sendMail = require("../helpers/sendMail.js");

const registerUser = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  db.query(
    `SELECT * FROM users WHERE LOWER(email) = LOWER(${db.escape(
      req.body.email
    )});`,
    (err, result) => {
      if (result && result.length) {
        return res.status(409).send({
          msg: "This email is already registered.",
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(400).send({
              msg: err,
            });
          } else {
            const userRole = "U";
            db.query(
              `INSERT INTO users (email, password, role) VALUES (${db.escape(
                req.body.email
              )}, ${db.escape(hash)}, '${userRole}');`,
              (err, result) => {
                if (err) {
                  return res.status(400).send({
                    msg: err,
                  });
                }

                let mailSubject = "Mail Verification";
                const randomToken = randomstring.generate();
                let content =
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
                  "<p>Need help?</p>" +
                  "<p>Please contact the email at nghs-wm20@student.tarc.edu.my</p>" +
                  "<p>Best Regards,</p>" +
                  "<p>Ng Hooi Seng</p>";

                sendMail(req.body.email, mailSubject, content);

                db.query(
                  "UPDATE users set token=?, token_created_at=NOW() where email=?",
                  [randomToken, req.body.email],
                  function (error, result, fields) {
                    if (error) {
                      return res.status(400).send({
                        msg: err,
                      });
                    }
                  }
                );

                return res.status(201).send({
                  msg: "Congratulations, you registered with us successfully! Please verify your email to proceed login!",
                });
              }
            );
          }
        });
      }
    }
  );
};

const registerAdmin = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  db.query(
    `SELECT * FROM users WHERE LOWER(email) = LOWER(${db.escape(
      req.body.email
    )});`,
    (err, result) => {
      if (result && result.length) {
        return res.status(409).send({
          msg: "This email is already registered.",
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(400).send({
              msg: err,
            });
          } else {
            const adminRole = "A";
            db.query(
              `INSERT INTO users (email, password, role) VALUES (${db.escape(
                req.body.email
              )}, ${db.escape(hash)}, '${adminRole}');`,
              (err, result) => {
                if (err) {
                  return res.status(400).send({
                    msg: err,
                  });
                }

                let mailSubject = "Mail Verification";
                const randomToken = randomstring.generate();
                let content =
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
                  "<p>Need help?</p>" +
                  "<p>Please contact the email at nghs-wm20@student.tarc.edu.my</p>" +
                  "<p>Best Regards,</p>" +
                  "<p>Ng Hooi Seng</p>";

                sendMail(req.body.email, mailSubject, content);

                db.query(
                  "UPDATE users set token=?, token_created_at=NOW() where email=?",
                  [randomToken, req.body.email],
                  function (error, result, fields) {
                    if (error) {
                      return res.status(400).send({
                        msg: err,
                      });
                    }
                  }
                );

                return res.status(201).send({
                  msg: "Congratulations, you registered with us successfully! Please verify your email to proceed login!",
                });
              }
            );
          }
        });
      }
    }
  );
};

const verifyMail = (req, res) => {
  const token = req.query.token;

  // First, update token_updated_at with the current time
  db.query(
    "UPDATE users SET token_updated_at=NOW() WHERE token=?",
    [token],
    (updateError, updateResult) => {
      if (updateError) {
        console.log(updateError.message);
        return res.status(500).render("error-page", {
          message: "An error occurred while updating the token's timestamp.",
        });
      }

      // Now, retrieve the user to check the token_created_at
      db.query(
        "SELECT * FROM users WHERE token=? LIMIT 1",
        [token],
        function (error, result) {
          if (error) {
            console.log(error.message);
            return res.status(500).render("error-page", {
              message: "An error occurred while verifying the email.",
            });
          }

          if (result.length > 0) {
            const user = result[0];
            const tokenCreatedAt = new Date(user.token_created_at);
            const tokenUpdatedAt = new Date(user.token_updated_at);
            const tokenAgeSeconds = (tokenUpdatedAt - tokenCreatedAt) / 1000;

            // Convert 24 hours into seconds for the expiration check
            const expirationTimeSeconds = 24 * 60 * 60; // 24 hours * 60 minutes per hour * 60 seconds per minute

            // Check if the token is expired
            if (tokenAgeSeconds > expirationTimeSeconds) {
              // If the token is expired, render the 'link-expired' page
              return res.status(400).render("link-expired", {
                userEmail: user.email,
              });
            }

            // Token is valid, proceed to update the user as verified
            db.query(
              "UPDATE users SET token=NULL, token_created_at=NULL, token_updated_at=NULL, is_verified=1 WHERE user_id=?",
              [user.user_id],
              (verificationError) => {
                if (verificationError) {
                  console.log(verificationError.message);
                  return res.status(500).render("error-page", {
                    message:
                      "An error occurred while updating the user status.",
                  });
                }

                // Verification successful
                return res.render("mail-verification", {
                  message:
                    "Email verification successful. You will now be redirected to the login page.",
                });
              }
            );
          } else {
            // Token not found or already used
            return res.status(404).render("404");
          }
        }
      );
    }
  );
};

const resendVerificationMail = (req, res) => {
  // Assuming you are sending email as a POST parameter
  const { email } = req.body;

  if (!email) {
    return res.status(400).send({ msg: "No email provided" });
  }

  // Check if the user exists, is not verified, and the cooldown has passed
  db.query(
    `SELECT token_created_at FROM users WHERE LOWER(email) = LOWER(${db.escape(
      email
    )}) AND is_verified = 0;`,
    (err, result) => {
      if (err) {
        return res.status(500).send({ msg: "Database query error" });
      }

      if (!result.length) {
        return res
          .status(400)
          .send({ msg: "User does not exist or is already verified" });
      }

      const user = result[0];
      const timeElapsed = new Date() - new Date(user.token_created_at);
      const waitTime = 15 * 60 * 1000; // 15 minutes in milliseconds

      if (timeElapsed < waitTime) {
        // If the time elapsed since the last token was created is less than the wait time
        const timeToWait = waitTime - timeElapsed;
        const minutesToWait = Math.ceil(timeToWait / 60000); // Convert milliseconds to minutes and round up
        return res
          .status(429)
          .send({
            msg: `Please wait ${minutesToWait} more minute(s) before requesting a new verification email.`,
          });
      }

      // Generate a new token
      const newToken = randomstring.generate();

      // Update the user with the new token and timestamp
      db.query(
        `UPDATE users SET token=?, token_created_at=NOW(), token_updated_at=NULL WHERE LOWER(email) = LOWER(?);`,
        [newToken, email],
        (updateErr) => {
          if (updateErr) {
            return res
              .status(500)
              .send({ msg: "Error updating user with new token" });
          }

          // Send verification email with the new token
          let mailSubject = "Mail Verification";
          let content =
            "<p>Hi there,</p>" +
            "<p>We've received a verification request for " +
            req.body.email +
            ". Please verify your email below.</p>" +
            "<p><a href='http://localhost:3000/mail-verification?token=" +
            newToken +
            "' style='background-color: darkblue; color: white; padding: 10px; text-decoration: none; display: inline-block;'>Verify Email</a></p>" +
            "<p>Can't see the button? Copy and paste this link into your browser:</p>" +
            "<p><a href='http://localhost:3000/mail-verification?token=" +
            newToken +
            "'>http://localhost:3000/mail-verification?token=" +
            newToken +
            "<p>Need help?</p>" +
            "<p>Please contact the email at nghs-wm20@student.tarc.edu.my</p>" +
            "<p>Best Regards,</p>" +
            "<p>Ng Hooi Seng</p>";

          sendMail(email, mailSubject, content);

          res
            .status(200)
            .send({ msg: "Verification email resent successfully" });
        }
      );
    }
  );
};

module.exports = {
  registerUser,
  registerAdmin,
  verifyMail,
  resendVerificationMail,
};
