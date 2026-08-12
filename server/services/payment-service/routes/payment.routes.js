import express from "express"
import { createOrder, createPaymentSession, getPaymentStatus, getRazorpayConfig } from "../controllers/payment.controller.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();


router.get("/razorpay-config", protect, getRazorpayConfig);

router.post(
    "/create-order",
    protect,
    createOrder
);

router.post(
    "/create-session",
    protect,
    createPaymentSession
);

router.get(
    "/status/:sessionId",
    protect,
    getPaymentStatus
);

export default router;

