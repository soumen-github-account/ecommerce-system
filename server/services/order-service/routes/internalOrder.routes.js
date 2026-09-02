import express from "express";

import {
    getOrderForSellerInternal,
    getOrderInternal,
    getSellerDashboardData,
    getSellerOrderByIdInternal,
    getSellerOrdersInternal,
    getSellerOrderStatsInternal,
    markSellerItemsPackedInternal,
    paymentFailedInternal,
    paymentSuccessInternal,
    updateOrderStatusInternal,
} from "../controllers/internalOrder.controller.js";
import { internalServiceAuth } from "../middlewares/internalServiceAuth.js";

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

router.get(
    "/orders/seller-dashboard/:sellerId", internalServiceAuth,
    getSellerDashboardData
);


router.get(
    "/orders/get-order/:orderId",
    internalServiceAuth,
    getOrderInternal
);


router.patch(
    "/orders/:orderId/payment-success",
    internalServiceAuth,
    paymentSuccessInternal
);


router.patch(
    "/orders/:orderId/payment-failed",
    internalServiceAuth,
    paymentFailedInternal
);

export default router;