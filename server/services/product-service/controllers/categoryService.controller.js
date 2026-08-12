import { Category } from "../models/CategoryModel.js";
import { SubCategory } from "../models/SubCategoryModel.js";
import { SubCategory2 } from "../models/SubCategoryLevel2Model.js";

export const createCategory = async (req, res) => {
  try {
    const { name, image } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    if (!image) {
      return res.status(400).json({
        success: false,
        message: "Category image is required",
      });
    }

    const category = await Category.create({
      name: name.trim(),
      image,
      subCategories: [],
    });

    return res.status(201).json({
      success: true,
      category,
    });
  } catch (error) {
    console.error("PRODUCT SERVICE - CREATE CATEGORY ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const createSubCategory = async (req, res) => {
  try {
    const { name, categoryId } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "SubCategory name is required",
      });
    }

    if (!categoryId) {
      return res.status(400).json({
        success: false,
        message: "Category is required",
      });
    }

    const category = await Category.findById(categoryId);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    const subCategory = await SubCategory.create({
      name: name.trim(),
      category: categoryId,
      level2Categories: [],
    });

    await Category.findByIdAndUpdate(categoryId, {
      $push: {
        subCategories: subCategory._id,
      },
    });

    return res.status(201).json({
      success: true,
      subCategory,
    });
  } catch (error) {
    console.error("PRODUCT SERVICE - CREATE SUBCATEGORY ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const createSubCategoryLevel2 = async (req, res) => {
  try {
    const { name, image, subCategoryId } = req.body;

    // --------------------------------
    // Validation
    // --------------------------------

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Level 2 category name is required",
      });
    }

    if (!subCategoryId) {
      return res.status(400).json({
        success: false,
        message: "SubCategory is required",
      });
    }

    // --------------------------------
    // Check SubCategory
    // --------------------------------

    const subCategory = await SubCategory.findById(subCategoryId);

    if (!subCategory) {
      return res.status(404).json({
        success: false,
        message: "SubCategory not found",
      });
    }

    // --------------------------------
    // Create Level 2 Category
    // --------------------------------

    const level2 = await SubCategory2.create({
      name: name.trim(),
      image,
      subCategory: subCategoryId,
    });

    // --------------------------------
    // Update SubCategory
    // --------------------------------

    await SubCategory.findByIdAndUpdate(subCategoryId, {
      $push: {
        level2Categories: level2._id,
      },
    });

    // --------------------------------
    // Response
    // --------------------------------

    return res.status(201).json({
      success: true,
      level2,
    });
  } catch (error) {
    console.error("PRODUCT SERVICE - CREATE LEVEL2 ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 1. Get All Categories
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({});
    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Get SubCategories by CategoryID
export const getSubCategories = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const subCategories = await SubCategory.find({ category: categoryId });
    res.status(200).json({ success: true, data: subCategories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 3. Get Level 2 Categories by SubCategoryID
export const getLevel2Categories = async (req, res) => {
  try {
    const { subCategoryId } = req.params;
    const level2Categories = await SubCategory2.find({
      subCategory: subCategoryId,
    });
    res.status(200).json({ success: true, data: level2Categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
