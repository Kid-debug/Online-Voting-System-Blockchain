// //feedbackController.js
// const Feedback = require("../models/feedback");
// const sequelize = require("../config/sequelize");
// const { validationResult } = require("express-validator");
// const jwt = require("jsonwebtoken");
// require("dotenv").config();

// const submitFeedback = async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     const token = req.headers.authorization?.split(" ")[1] || req.cookies.jwt;

//     if (!token) {
//       return res
//         .status(401)
//         .json({ msg: "No token provided, authorization denied." });
//     }

//     try {
//       const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
//       const userEmail = decoded.email;

//     //   const user = await User.findOne({ where: { email: userEmail } });
//     //   if (user) {
//     //     const { currentPassword, newPassword } = req.body;
//     //     const isMatch = await bcrypt.compare(currentPassword, user.password);

//     //     if (isMatch) {
//     //       if (newPassword !== currentPassword) {
//     //         const newHashedPassword = await bcrypt.hash(newPassword, 10);
//     //         const [updatedRows] = await User.update(
//     //           { password: newHashedPassword },
//     //           { where: { email: userEmail } }
//     //         );

//     //         if (updatedRows > 0) {
//     //           return res
//     //             .status(201)
//     //             .json({ msg: "Password successfully updated." });
//     //         } else {
//     //           return res.status(500).json({
//     //             msg: "Failed to update password. Please try again.",
//     //           });
//     //         }
//     //       } else {
//     //         return res.status(400).json({
//     //           msg: "New password must be different from the current password.",
//     //         });
//     //       }
//     //     } else {
//     //       return res.status(400).json({ msg: "Current password is incorrect." });
//     //     }
//     //   } else {
//     //     return res.status(404).json({ msg: "User not found." });
//     //   }
//     } catch (error) {
//       console.error("Error in submit feedback:", error);
//       if (error.name === "TokenExpiredError") {
//         return res.status(401).json({ msg: "Token expired." });
//       } else {
//         return res.status(401).json({ msg: "Invalid token." });
//       }
//     }
//   };
