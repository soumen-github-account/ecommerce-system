// srvices/routes/auth.route.js

import express from "express"
import { createCategory, createSubCategory, createSubCategoryLevel2, getCategories, getLevel2Categories, getSubCategories } from "../controllers/categoryService.controller.js";

const router = express.Router();

router.post("/internal/create-category", createCategory)
router.post("/internal/create-subcategory", createSubCategory);
router.post("/internal/create-subcategory2", createSubCategoryLevel2);

router.get("/categories", getCategories);
router.get("/categories/:categoryId/subcategories", getSubCategories);
router.get("/subcategories/:subCategoryId/level2", getLevel2Categories);


export default router;
