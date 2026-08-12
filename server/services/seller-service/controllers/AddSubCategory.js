import axios from "axios";

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

    const response = await axios.post(
      `${process.env.PRODUCT_SERVICE_URL}/products/category/internal/create-subcategory`,
      {
        name: name.trim(),
        categoryId,
      },
    );

    return res.status(response.status).json(response.data);
  } catch (error) {
    console.error(
      "CREATE SUBCATEGORY ERROR:",
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
