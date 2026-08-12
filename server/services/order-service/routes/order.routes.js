// srvices/routes/auth.route.js

import express from "express"
import { createInternalOrder, getInternalOrder, getMyOrders, getOrderById, getOrderTracking, updateOrderPayment } from "../controllers/order.controller.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getMyOrders);
router.get("/:id", protect, getOrderById);
router.get("/:id/tracking", protect, getOrderTracking);

router.post(
  "/internal/create-order",
  createInternalOrder
);
router.get(
    "/internal/:id",
    protect,
    getInternalOrder
);

router.patch(
    "/internal/:id/payment",
    protect,
    updateOrderPayment
);

export default router;

