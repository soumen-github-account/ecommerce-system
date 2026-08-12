
import express from "express"
import { getOrderProducts } from "../controllers/product.controller.js";
import { getOrderProductsInternal } from "../controllers/internalProduct.controller.js";

const router = express.Router();
router.post(
    "/order-products",
    getOrderProducts
);

router.post(
    "/order-products-internal",
    getOrderProductsInternal
);


export default router;
