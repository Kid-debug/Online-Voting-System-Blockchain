const Category = require("../models/category");
const sequelize = require("../config/sequelize");
const { validationResult } = require("express-validator");

const addCategory = async (req, res) => {
  // Checks for validation errors from validation.js middleware
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { category_name } = req.body;

    // Check for uniqueness in the database
    const existingCategory = await Category.findOne({
      where: { category_name },
    });
    if (existingCategory) {
      return res.status(409).json({ msg: "Category name already exists." });
    }

    // If the category name passes all validations, create the new category
    const newCategory = await Category.create({ category_name });
    return res.status(201).json({
      msg: "New category created successfully.",
      category: newCategory,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ msg: "Server error while creating category." });
  }
};

const retrieveCategory = async (req, res) => {
  try {
    // Retrieve all categories from the database
    const categories = await Category.findAll();
    return res.status(200).json(categories);
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ msg: "Server error while retrieving categories." });
  }
};

module.exports = {
  addCategory,
  retrieveCategory,
};
