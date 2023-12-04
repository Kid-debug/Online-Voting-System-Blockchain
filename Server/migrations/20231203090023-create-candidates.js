// "use strict";

// module.exports = {
//   up: async (queryInterface) => {
//     await queryInterface.sequelize.query(`
//       CREATE TABLE candidates (
//         candidate_id INT AUTO_INCREMENT PRIMARY KEY,
//         candidate_name VARCHAR(100) NOT NULL,
//         student_id VARCHAR(10) NOT NULL,
//         candidate_image VARCHAR(200),
//         image_hash VARCHAR(64)
//       )
//     `);
//   },

//   down: async (queryInterface) => {
//     await queryInterface.sequelize.query("DROP TABLE IF EXISTS candidates");
//   },
// };
