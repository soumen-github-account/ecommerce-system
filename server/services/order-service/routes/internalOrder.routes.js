import express from "express";

import {
    getOrderForSellerInternal,
    getSellerOrderByIdInternal,
    getSellerOrdersInternal,
    getSellerOrderStatsInternal,
    markSellerItemsPackedInternal,
    updateOrderStatusInternal,
} from "../controllers/internalOrder.controller.js";

const router = express.Router();

router.post(
    "/seller/orders",
    getSellerOrdersInternal
);
router.post(
    "/seller/order/:orderId",
    getSellerOrderByIdInternal
);

router.get(
    "/orders/:orderId",
    getOrderForSellerInternal
);

router.patch(
  "/orders/:orderId/seller-items/packed",
  markSellerItemsPackedInternal
);

router.patch(
  "/orders/:orderId/status",
  updateOrderStatusInternal
);

router.post(
  "/seller/order-stats",
  getSellerOrderStatsInternal
);


export default router;