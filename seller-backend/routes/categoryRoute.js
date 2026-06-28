import express from "express";
import { getCategories, getLevel2Categories, getSubCategories } from "../controllers/CategoryController.js";
import { upload } from "../middlewares/multer.js";
import { createCategory } from "../controllers/AddCategory.js";
import { createSubCategory } from "../controllers/AddSubCategory.js";
import { createSubCategoryLevel2 } from "../controllers/AddSubCategory2.js";

const router = express.Router();

router.get("/categories", getCategories);
router.get("/categories/:categoryId/subcategories", getSubCategories);
router.get("/subcategories/:subCategoryId/level2", getLevel2Categories);

router.post("/category", upload.single("image"), createCategory);
router.post("/subcategory", createSubCategory);
router.post("/subcategory-level2", upload.single("image"), createSubCategoryLevel2);

export default router;