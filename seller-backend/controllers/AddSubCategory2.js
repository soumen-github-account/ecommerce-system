
import { SubCategory2 } from "../models/SubCategoryLevel2Model.js";
import { SubCategory } from "../models/SubCategoryModel.js";
import { uploadImage } from "../utils/uploadToCloudinary.js";

export const createSubCategoryLevel2 = async (req, res) => {
  try {
    const { name, subCategoryId } = req.body;
    const file = req.file;

    const uploadRes = await uploadImage(file, "subCategoryLevel2");

    const level2 = await SubCategory2.create({
      name,
      image: uploadRes.secure_url,
      subCategory: subCategoryId,
    });

    await SubCategory.findByIdAndUpdate(subCategoryId, {
      $push: { level2Categories: level2._id },
    });

    res.status(201).json({ success: true, level2 });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};