import express from "express"
import { protect } from "../middlewares/authMiddleware.js";
import {createPaymentSession, getPaymentStatus } from "../controllers/paymentController.js";
import { razorpayWebhook } from "../controllers/paymentWebhookController.js";


const router = express.Router();

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

router.post(
    "/webhook",
    express.raw({
        type: "application/json"
    }),
    razorpayWebhook
);

export default router