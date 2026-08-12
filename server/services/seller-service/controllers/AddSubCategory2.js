// import { SubCategory2 } from "../models/SubCategoryLevel2Model.js";
// import { SubCategory } from "../models/SubCategoryModel.js";
// import { uploadImage } from "../utils/uploadToCloudinary.js";

// export const createSubCategoryLevel2 = async (req, res) => {
//   try {
//     const { name, subCategoryId } = req.body;
//     const file = req.file;

//     const uploadRes = await uploadImage(file, "subCategoryLevel2");

//     const level2 = await SubCategory2.create({
//       name,
//       image: uploadRes.secure_url,
//       subCategory: subCategoryId,
//     });

//     await SubCategory.findByIdAndUpdate(subCategoryId, {
//       $push: { level2Categories: level2._id },
//     });

//     res.status(201).json({ success: true, level2 });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

import axios from "axios";
import { uploadImage } from "../utils/uploadToCloudinary.js";

export const createSubCategoryLevel2 = async (req, res) => {
  try {
    const { name, subCategoryId } = req.body;
    const file = req.file;

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

    if (!file) {
      return res.status(400).json({
        success: false,
        message: "Level 2 category image is required",
      });
    }

    const uploadRes = await uploadImage(file, "subCategoryLevel2");

    const response = await axios.post(
      `${process.env.PRODUCT_SERVICE_URL}/products/category/internal/create-subcategory2`,
      {
        name: name.trim(),
        image: uploadRes.secure_url,
        subCategoryId,
      },
    );

    return res.status(response.status).json(response.data);
  } catch (error) {
    console.error(
      "CREATE LEVEL2 CATEGORY ERROR:",
      error.response?.data || error.message,
    );

    return res.status(error.response?.status || 500).json(
      error.response?.data || {
        success: false,
        message: error.message,
      },
    );
  }
};
