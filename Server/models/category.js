// models/category.js
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

class Category extends Model {}

Category.init(
  {
    category_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    category_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true, // enforce uniqueness
      validate: {
        len: [1, 100], // ensure string is within length bounds
        notNull: { msg: "The category name is required" },
      },
    },
  },
  {
    sequelize,
    modelName: "Category",
    tableName: "category",
    timestamps: false, // because we are setting default values ourselves
  }
);

module.exports = Category;
