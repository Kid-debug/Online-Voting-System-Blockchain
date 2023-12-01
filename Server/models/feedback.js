//models/feedback.js
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize"); // Adjust the path as necessary for your project
const User = require("../models/user");

class Feedback extends Model {}

Feedback.init(
  {
    feedback_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users", // This should be the model name, which is typically the singular form of the table name.
        key: "user_id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
      },
    },
    content: {
      type: DataTypes.STRING(300),
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: "Under Review",
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "Feedback",
    tableName: "feedbacks",
    timestamps: false, // This is set to false because we are defining the timestamp columns explicitly
    underscored: true, // This option is used if the table column names are snake_case
  }
);

// Define the associations directly after the model definitions
User.hasMany(Feedback, { foreignKey: "user_id" });
Feedback.belongsTo(User, { foreignKey: "user_id" });

module.exports = Feedback;
