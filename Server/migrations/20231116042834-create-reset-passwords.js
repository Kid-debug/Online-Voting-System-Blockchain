"use strict";

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.sequelize.query(`
      CREATE TABLE reset_passwords (
        email VARCHAR(255) NOT NULL PRIMARY KEY,
        token VARCHAR(255) NOT NULL,
        verification_code VARCHAR(10) NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);
  },

  down: async (queryInterface) => {
    await queryInterface.sequelize.query(
      "DROP TABLE IF EXISTS reset_passwords"
    );
  },
};
