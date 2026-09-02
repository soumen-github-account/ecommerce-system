
import express from "express"
import { getOrderProducts } from "../controllers/product.controller.js";
import { deleteProductInternal, getOrderProductsInternal, getSellerLowStock, getSellerProductsInternal, reduceStockInternal, updateProductInternal, updateVariantInternal, updateVariantStatusInternal } from "../controllers/internalProduct.controller.js";
import { upload } from "../middlewares/multer.js";
import { internalServiceAuth } from "../middlewares/internalServiceAuth.js";

const router = express.Router();
router.post(
    "/order-products",
    getOrderProducts
);

router.post(
    "/order-products-internal",
    getOrderProductsInternal
);

router.get(
    "/seller/:sellerId/products",
    getSellerProductsInternal
);

router.delete("/product-delete/:productId", deleteProductInternal);
router.patch("/variants/:variantId/status", updateVariantStatusInternal);
router.patch(
    "/products/:productId",
    updateProductInternal
);
router.patch(
  "/variants/:variantId",
  upload.any(),
  updateVariantInternal
);

router.get(
    "/products/seller-dashboard/:sellerId/low-stock", internalServiceAuth,
    getSellerLowStock
)

router.post("/products/reduce-stock", internalServiceAuth, reduceStockInternal)

export default router;
