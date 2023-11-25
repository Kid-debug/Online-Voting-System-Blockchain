"use strict";

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.sequelize.query(`
      CREATE TABLE users (
        user_id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        password VARCHAR(100) NOT NULL,
        wallet_address VARCHAR(100),
        role CHAR(1) NOT NULL,
        is_verified TINYINT DEFAULT 0,
        token TEXT,
        token_created_at TIMESTAMP NULL,
        token_updated_at TIMESTAMP NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
  },

  down: async (queryInterface) => {
    await queryInterface.sequelize.query("DROP TABLE IF EXISTS users");
  },
};
