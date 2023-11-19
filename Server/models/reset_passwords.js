// models/resetPassword.js
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

class ResetPassword extends Model {}

ResetPassword.init(
  {
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      primaryKey: true,
    },
    token: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "ResetPassword",
    tableName: "reset_passwords",
    timestamps: false, // we don't need Sequelize to handle timestamps
  }
);

module.exports = ResetPassword;
