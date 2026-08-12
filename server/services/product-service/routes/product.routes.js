// srvices/routes/auth.route.js

import express from "express"
import { getAllCategory, getAllProduct, getAllProductByCategory, getCartProducts, getInternalCartProducts, getNestedCategories, getNestedSubCategories, getOrderProducts, getProductById, getWishlistProducts, searchProducts } from "../controllers/product.controller.js";

const router = express.Router();

router.get("/categories", getAllCategory);
router.get("/nested/:categoryId", getNestedSubCategories);
router.get("/nested-all", getNestedCategories);

router.get("/products", getAllProduct);
router.get("/products/search", searchProducts);
router.get("/products/category/:categoryId", getAllProductByCategory);
router.get("/products/:id", getProductById);

router.post("/wishlist-details", getWishlistProducts);
router.post("/cart-products", getCartProducts);
router.post("/order-products", getOrderProducts);
router.post("/internal/cart-products", getInternalCartProducts);

export default router;
