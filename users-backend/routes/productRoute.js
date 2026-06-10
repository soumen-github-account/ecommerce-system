
import express from "express"
import { getAllCategory, getAllProduct, getAllProductByCategory, getNestedCategories, getNestedSubCategories, getProductById, searchProducts } from "../controllers/productController.js"

const router = express.Router()

router.get("/categories", getAllCategory);
router.get("/nested/:categoryId", getNestedSubCategories);
router.get("/nested-all", getNestedCategories);

router.get("/products", getAllProduct);
router.get("/products/search", searchProducts);
router.get("/products/category/:categoryId", getAllProductByCategory);
router.get("/products/:id", getProductById);

export default router