import { uploadImage } from "../utils/uploadToCloudinary.js";
import axios from "axios";

export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const file = req.file;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    if (!file) {
      return res.status(400).json({
        success: false,
        message: "Category image is required",
      });
    }

    const uploadRes = await uploadImage(file, "categories");

    const response = await axios.post(
      `${process.env.PRODUCT_SERVICE_URL}/products/category/internal/create-category`,
      {
        name: name.trim(),
        image: uploadRes.secure_url,
      },
    );

    return res.status(response.status).json(response.data);
  } catch (error) {
    console.error(
      "CREATE CATEGORY ERROR:",
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
