"use strict";

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.sequelize.query(`
      CREATE TABLE IF NOT EXISTS category (
        category_id INT AUTO_INCREMENT PRIMARY KEY,
        category_name VARCHAR(100) NOT NULL
      )
    `);
  },

  down: async (queryInterface) => {
    await queryInterface.sequelize.query("DROP TABLE IF EXISTS category");
  },
};
