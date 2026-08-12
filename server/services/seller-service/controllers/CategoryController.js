// import { Category } from "../models/CategoryModel.js";
// import { SubCategory2 } from "../models/SubCategoryLevel2Model.js";
// import { SubCategory } from "../models/SubCategoryModel.js";


// // 1. Get All Categories
// export const getCategories = async (req, res) => {
//   try {
//     const categories = await Category.find({});
//     res.status(200).json({ success: true, data: categories });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // 2. Get SubCategories by CategoryID
// export const getSubCategories = async (req, res) => {
//   try {
//     const { categoryId } = req.params;
//     const subCategories = await SubCategory.find({ category: categoryId });
//     res.status(200).json({ success: true, data: subCategories });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // 3. Get Level 2 Categories by SubCategoryID
// export const getLevel2Categories = async (req, res) => {
//   try {
//     const { subCategoryId } = req.params;
//     const level2Categories = await SubCategory2.find({ subCategory: subCategoryId });
//     res.status(200).json({ success: true, data: level2Categories });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };