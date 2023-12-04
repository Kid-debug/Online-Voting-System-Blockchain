const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();
const {
  signUpValidation,
  loginValidation,
  forgetValidation,
  changePasswordValidation,
  feedbackValidation,
  updateFeedbackValidation,
  categoryValidation,
  // candidateValidation,
} = require("../helpers/validation");
const userController = require("../controllers/userController");
const feedbackController = require("../controllers/feedbackController");
const categoryController = require("../controllers/categoryController");
// const candidateController = require("../controllers/candidateController");

// multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});

// multer upload configuration
const upload = multer({
  storage: storage,
  limits: { fileSize: 1 * 1024 * 1024 }, // 1MB size limit
  fileFilter: (req, file, cb) => {
    // Validate file name
    if (!/^[a-zA-Z0-9_.-]+$/.test(file.originalname)) {
      return cb(new Error("Invalid file name."));
    }
    cb(null, true);
  },
});

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

//candidate
// router.post(
//   "/createCandidate",
//   upload.single("candidate_image"), // Ensure this matches the 'name' attribute in the form
//   candidateValidation,
//   candidateController.addCandidate
// );

// router.get("/retrieveCandidate", candidateController.retrieveCandidate);
// router.get(
//   "/retrieveCandidate/:candidateId",
//   candidateController.getCandidateById
// );
// router.put(
//   "/updateCandidate/:candidateId",
//   upload.single("candidate_image"), // Ensure this matches the 'name' attribute in the form
//   candidateValidation,
//   candidateController.updateCandidate
// );
// router.delete(
//   "/deleteCandidate/:candidateId",
//   candidateController.deleteCandidate
// );

// // Error handling for multer
// router.use((error, req, res, next) => {
//   // Handle multer file size error
//   if (error instanceof multer.MulterError && error.code === "LIMIT_FILE_SIZE") {
//     return res
//       .status(400)
//       .json({ msg: "File size limit has been exceeded (1MB max)." });
//   }
//   // Handle other multer errors
//   else if (error instanceof multer.MulterError) {
//     return res
//       .status(400)
//       .json({ msg: "Error in file upload: " + error.message });
//   }
//   // Handle invalid file name error
//   //Examples of Valid File Names: image123.jpg, photo_profile.png,
//   //Examples of Invalid File Names: image name.jpg (contains spaces), photo#profile.png (contains a special character #)
//   else if (error.message === "Invalid file name.") {
//     return res.status(400).json({
//       msg: "Invalid file name. Valid file names can include letters, numbers, underscores (_), hyphens (-), and periods (.). They should not contain spaces or special characters like @, #, $. Examples: 'image123.jpg', 'photo_profile.png', 'candidate-image_01.jpeg', 'file2021-11-30.png'.",
//     });
//   }
//   // Other errors
//   else if (error) {
//     return res
//       .status(500)
//       .json({ msg: "An error occurred while processing your request." });
//   }
//   next();
// });
module.exports = router;
