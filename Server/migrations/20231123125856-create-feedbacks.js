"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("feedbacks", {
      feedback_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "users", // This should be the table name for users in lowercase.
          key: "user_id", // This should be the column name for the primary key in the users table.
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE", // If a user is deleted, delete their feedback as well.
      },
      rating: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
          min: 1,
          max: 5,
        },
        comment: "Represents a user rating from 1 (sad) to 5 (happy)",
      },
      content: {
        type: Sequelize.STRING(300),
        allowNull: false,
      },
      status: {
        type: Sequelize.STRING(100),
        allowNull: true,
        defaultValue: "Under Review",
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"), // Sets the default value to the current timestamp.
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"), // Sets the default value to the current timestamp.
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("feedbacks");
  },
};
