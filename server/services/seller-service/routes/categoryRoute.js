import express from "express";
import { upload } from "../middlewares/multer.js";
import { createCategory } from "../controllers/AddCategory.js";
import { createSubCategory } from "../controllers/AddSubCategory.js";
import { createSubCategoryLevel2 } from "../controllers/AddSubCategory2.js";

const router = express.Router();

router.post("/create-category", upload.single("image"), createCategory);
router.post("/create-subcategory", createSubCategory);
router.post("/create-subcategory-level2", upload.single("image"), createSubCategoryLevel2);

export default router;