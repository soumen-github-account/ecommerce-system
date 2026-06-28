
import { Category } from "../models/CategoryModel.js";
import { SubCategory } from "../models/SubCategoryModel.js";
import { uploadImage } from "../utils/uploadToCloudinary.js";

export const createSubCategory = async (req, res) => {
  try {
    const { name, categoryId } = req.body;
    // const file = req.file;

    // const uploadRes = await uploadImage(file, "subcategories");

    const subCategory = await SubCategory.create({
      name,
      category: categoryId,
      level2Categories: [],
    });

    await Category.findByIdAndUpdate(categoryId, {
      $push: { subCategories: subCategory._id },
    });

    res.status(201).json({ success: true, subCategory });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
