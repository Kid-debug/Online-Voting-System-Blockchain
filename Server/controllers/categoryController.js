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
      msg: `New category "${newCategory.category_name}" created successfully.`,
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

const getCategoryById = async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    const category = await Category.findOne({
      where: { category_id: categoryId },
    });

    if (!category) {
      return res.status(404).json({ msg: "Category not found" });
    }

    return res.status(200).json(category);
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ msg: "Server error while retrieving category." });
  }
};

const updateCategory = async (req, res) => {
  // Extracting the validation errors from the request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { categoryId } = req.params;
  const { category_name } = req.body;

  try {
    // Find the category by ID
    const category = await Category.findByPk(categoryId);
    if (!category) {
      return res.status(404).json({ msg: "Category not found." });
    }

    // Check for uniqueness in the database
    const existingCategory = await Category.findOne({
      where: { category_name: category_name },
    });

    if (existingCategory) {
      return res.status(409).json({ msg: "Category name cannot be the same." });
    }

    // Update the category's name
    category.category_name = category_name;
    await category.save();

    // Return a success response
    return res
      .status(200)
      .json({ msg: "Category updated successfully.", category });
  } catch (err) {
    console.error("Error updating category:", err);
    return res
      .status(500)
      .json({ msg: "Server error while updating category." });
  }
};

const deleteCategory = async (req, res) => {
  const { categoryId } = req.params;

  try {
    // Find the category to ensure it exists
    const categoryToDelete = await Category.findByPk(categoryId);

    if (!categoryToDelete) {
      return res.status(404).json({ msg: "Category not found" });
    }

    const categoryName = categoryToDelete.category_name;

    // Delete the category
    await categoryToDelete.destroy();

    // Optionally, you can retrieve the updated list of categories after deletion
    const updatedCategories = await Category.findAll();

    return res.status(200).json({
      msg: `Category "${categoryName}" deleted successfully`,
      categories: updatedCategories,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ msg: "Server error while deleting category." });
  }
};

module.exports = {
  addCategory,
  retrieveCategory,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
