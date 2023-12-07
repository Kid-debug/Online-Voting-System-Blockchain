// models/user.js
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

class User extends Model {}

User.init(
  {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true, // ensures email is a valid email
      },
    },
    password: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    role: {
      type: DataTypes.CHAR(1),
      allowNull: false,
      defaultValue: "U", // Assuming 'U' is a default role
    },
    is_verified: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      defaultValue: 0,
    },
    token: {
      type: DataTypes.TEXT,
      allowNull: true, // allow null because not all users will have tokens all the time
    },
    token_created_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    token_updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW, // Sequelize manages created_at & updated_at
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW, // Sequelize manages created_at & updated_at
    },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "users",
    timestamps: false, // because we are setting default values ourselves
  }
);

module.exports = User;

