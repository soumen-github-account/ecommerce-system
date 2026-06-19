import express from "express";
import { getCategories, getLevel2Categories, getSubCategories } from "../controllers/CategoryController.js";

const router = express.Router();

router.get("/categories", getCategories);
router.get("/categories/:categoryId/subcategories", getSubCategories);
router.get("/subcategories/:subCategoryId/level2", getLevel2Categories);

export default router;