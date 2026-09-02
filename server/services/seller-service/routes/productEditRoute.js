
import express from "express"
import sellerAuth from "../middlewares/sellerAuth.js";
import { deleteSellerProduct, getMyProductById, getMyProducts, updateSellerProduct, updateSellerVariant, updateSellerVariantStatus } from "../controllers/ProductEditController.js";
import { upload } from "../middlewares/multer.js";

const router = express.Router()

router.get("/products", sellerAuth, getMyProducts);
router.get("/products/:id", sellerAuth, getMyProductById);
router.delete("/product-delete/:productId", sellerAuth, deleteSellerProduct);
router.patch("/variants/:variantId/status", sellerAuth, updateSellerVariantStatus);

router.patch(
    "/products/edit/:productId",
    sellerAuth,
    updateSellerProduct
);


// ==========================================================
// UPDATE VARIANT
// ==========================================================

router.patch(
  "/variants/edit/:variantId",
  sellerAuth, upload.any(),
  updateSellerVariant
);

export default router