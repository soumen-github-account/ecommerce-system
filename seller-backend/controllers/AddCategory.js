
import { Category } from "../models/CategoryModel.js";
import { uploadImage } from "../utils/uploadToCloudinary.js";

export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    const file = req.file;

    const uploadRes = await uploadImage(file, "categories");

    const category = await Category.create({
      name,
      image: uploadRes.secure_url,
      subCategories: [],
    });

    res.status(201).json({ success: true, category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
