// const Candidate = require("../models/candidate");
// const { validationResult } = require("express-validator");
// const fs = require("fs");
// const crypto = require("crypto");
// const path = require("path");

// const addCandidate = async (req, res) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     if (req.file) fs.unlinkSync(req.file.path);
//     return res.status(400).json({ errors: errors.array() });
//   }

//   try {
//     const { candidate_name, student_id } = req.body;
//     const candidate_image = req.file;

//     if (!candidate_image) {
//       return res.status(400).json({ msg: "Candidate image file is required." });
//     }

//     // Candidate name can be the same, so no need to check the name

//     // Check for existing candidate by student_id
//     const existingStudentID = await Candidate.findOne({
//       where: { student_id },
//     });
//     if (existingStudentID) {
//       fs.unlinkSync(candidate_image.path);
//       return res
//         .status(409)
//         .json({ msg: "Student ID of the candidate already exists." });
//     }

//     // Convert student_id to uppercase
//     const formattedStudentID = student_id.toUpperCase();

//     // Compute the hash for the image
//     const imageBuffer = fs.readFileSync(candidate_image.path);
//     const imageHash = crypto
//       .createHash("sha256")
//       .update(imageBuffer)
//       .digest("hex");

//     // Check for existing image hash
//     const existingImageHash = await Candidate.findOne({
//       where: { image_hash: imageHash },
//     });
//     if (existingImageHash) {
//       fs.unlinkSync(candidate_image.path);
//       return res
//         .status(400)
//         .json({ msg: "An image with the same content already exists." });
//     }

//     // Create new candidate record with image path and hash
//     const newCandidate = await Candidate.create({
//       candidate_name,
//       student_id: formattedStudentID,
//       candidate_image: path.basename(candidate_image.path), // Store the file path
//       image_hash: imageHash, // Store the hash
//     });

//     return res.status(201).json({
//       msg: `New candidate "${newCandidate.candidate_name}" created successfully.`,
//       candidate: newCandidate,
//     });
//   } catch (err) {
//     console.error(err);
//     if (req.file) fs.unlinkSync(req.file.path);
//     return res
//       .status(500)
//       .json({ msg: "Server error while creating candidate." });
//   }
// };

// const retrieveCandidate = async (req, res) => {
//   try {
//     const candidates = await Candidate.findAll({
//       attributes: [
//         "candidate_id",
//         "candidate_name",
//         "candidate_image",
//         "student_id",
//       ],
//     });
//     // Map over each candidate and create a full URL for the image
//     const candidatesWithFullImageUrls = candidates.map((candidate) => {
//       return {
//         ...candidate.get({ plain: true }),
//         // 'candidate_image' contains only the filename
//         candidate_image: candidate.candidate_image
//           ? `${req.protocol}://${req.get("host")}/images/${
//               candidate.candidate_image
//             }`
//           : null,
//       };
//     });
//     res.status(200).json(candidatesWithFullImageUrls);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ msg: "Server error while retrieving candidates." });
//   }
// };

// const getCandidateById = async (req, res) => {
//   try {
//     const candidateId = req.params.candidateId;
//     const candidates = await Candidate.findOne({
//       attributes: [
//         "candidate_id",
//         "candidate_name",
//         "candidate_image",
//         "student_id",
//       ],
//       where: { candidate_id: candidateId },
//     });

//     if (!candidates) {
//       return res.status(404).json({ msg: "Candidate not found" });
//     }

//     // Create a full URL for the image
//     const candidate = {
//       ...candidates.get({ plain: true }),
//       // 'candidate_image' contains only the filename
//       candidate_image: candidates.candidate_image
//         ? `${req.protocol}://${req.get("host")}/images/${
//             candidates.candidate_image
//           }`
//         : null,
//     };

//     return res.status(200).json(candidate);
//   } catch (err) {
//     console.error(err);
//     return res
//       .status(500)
//       .json({ msg: "Server error while retrieving candidate." });
//   }
// };

// const updateCandidate = async (req, res) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     if (req.file) fs.unlinkSync(req.file.path);
//     return res.status(400).json({ errors: errors.array() });
//   }

//   const { candidateId } = req.params;

//   try {
//     const { candidate_name, student_id } = req.body;
//     const candidate_image = req.file;

//     // Find the candidate by ID
//     const candidate = await Candidate.findByPk(candidateId);

//     if (!candidate) {
//       return res.status(404).json({ msg: "Candidate not found." });
//     }

//     if (!candidate_image) {
//       return res.status(400).json({ msg: "Candidate image file is required." });
//     }

//     // Candidate name can be the same, so no need to check the name

//     // Check for existing candidate by student_id
//     const existingStudentID = await Candidate.findOne({
//       where: { student_id },
//     });

//     if (existingStudentID) {
//       fs.unlinkSync(candidate_image.path);
//       return res
//         .status(409)
//         .json({ msg: "Student ID of the candidate already exists." });
//     }

//     // Convert student_id to uppercase
//     const formattedStudentID = student_id.toUpperCase();

//     // Compute the hash for the image
//     const imageBuffer = fs.readFileSync(candidate_image.path);
//     const imageHash = crypto
//       .createHash("sha256")
//       .update(imageBuffer)
//       .digest("hex");

//     // Check for existing image hash
//     const existingImageHash = await Candidate.findOne({
//       where: { image_hash: imageHash },
//     });
//     if (existingImageHash) {
//       fs.unlinkSync(candidate_image.path);
//       return res
//         .status(400)
//         .json({ msg: "An image with the same content already exists." });
//     }

//     // Get the current image path before updating
//     const currentImagePath = candidate.candidate_image;

//     // Update the candidate record with image path and hash
//     const updatedCandidate = await Candidate.update(
//       {
//         candidate_name: candidate_name,
//         student_id: formattedStudentID,
//         candidate_image: path.basename(candidate_image.path), // Store the file path
//         image_hash: imageHash, // Store the hash
//       },
//       { where: { candidate_id: candidateId } }
//     );

//     // If the candidate was updated and there is an old image, delete it
//     if (updatedCandidate && currentImagePath) {
//       const fullPath = path.join("public/images", currentImagePath);
//       if (fs.existsSync(fullPath)) {
//         fs.unlinkSync(fullPath);
//       }
//     }

//     return res.status(201).json({
//       msg: `Candidate updated successfully.`,
//       candidate: updatedCandidate,
//     });
//   } catch (err) {
//     console.error("Error updating candidate:", err);
//     if (req.file) fs.unlinkSync(req.file.path);
//     return res
//       .status(500)
//       .json({ msg: "Server error while updating candidate." });
//   }
// };

// const deleteCandidate = async (req, res) => {
//   const { candidateId } = req.params;

//   try {
//     // Find the candidate to ensure it exists
//     const candidateToDelete = await Candidate.findByPk(candidateId);

//     if (!candidateToDelete) {
//       return res.status(404).json({ msg: "Candidate not found" });
//     }

//     const candidateName = candidateToDelete.candidate_name;
//     const imageFilename = candidateToDelete.candidate_image;
//     // Construct the full path
//     const imagePath = path.join("public/images", imageFilename);

//     // Delete the image file
//     if (fs.existsSync(imagePath)) {
//       fs.unlinkSync(imagePath);
//     }

//     // Delete the candidate
//     await candidateToDelete.destroy();

//     // Optionally, you can retrieve the updated list of candidates after deletion
//     const updatedCandidates = await Candidate.findAll();

//     return res.status(200).json({
//       msg: `Candidate "${candidateName}" deleted successfully`,
//       candidates: updatedCandidates,
//     });
//   } catch (err) {
//     console.error(err);
//     return res
//       .status(500)
//       .json({ msg: "Server error while deleting candidate." });
//   }
// };

// module.exports = {
//   addCandidate,
//   retrieveCandidate,
//   getCandidateById,
//   updateCandidate,
//   deleteCandidate,
// };
