// // models/candidate.js
// const { Model, DataTypes } = require("sequelize");
// const sequelize = require("../config/sequelize");

// class Candidate extends Model {}

// Candidate.init(
//   {
//     candidate_id: {
//       type: DataTypes.INTEGER,
//       primaryKey: true,
//       autoIncrement: true,
//       allowNull: false,
//     },
//     candidate_name: {
//       type: DataTypes.STRING(100),
//       allowNull: false,
//       validate: {
//         len: [1, 100], // ensure string is within length bounds
//         notNull: { msg: "The candidate name is required" },
//       },
//     },
//     student_id: {
//       type: DataTypes.STRING(10),
//       allowNull: false,
//       unique: true, // enforce uniqueness
//       validate: {
//         len: [1, 10], // ensure string is within length bounds
//         notNull: { msg: "The student id of candidate is required" },
//       },
//     },
//     candidate_image: {
//       type: DataTypes.STRING(200),
//       allowNull: true, // allow null since it's not a required field
//     },
//     image_hash: {
//       type: DataTypes.STRING(64), // Enough for a SHA-256 hash
//       allowNull: true, // Allows for images to be optional
//       unique: true, // Prevents duplicate images based on hash
//     },
//   },
//   {
//     sequelize,
//     modelName: "Candidate",
//     tableName: "candidates",
//     timestamps: false, // because we are setting default values ourselves
//   }
// );

// module.exports = Candidate;
