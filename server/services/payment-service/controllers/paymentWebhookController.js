import crypto from "crypto";

import { PaymentSession } from "../models/PaymentSession.js";
import { PaymentTransaction } from "../models/PaymentTransaction.js";
import { getOrder, markOrderPaymentSuccess } from "../clients/order.client.js";


import {
    reduceStock
} from "../clients/product.client.js";

import {
    clearCart
} from "../clients/user.client.js";

export const razorpayWebhook = async (
    req,
    res
) => {

    try {

        // =========================================
        // VERIFY RAZORPAY
        // =========================================

        const signature =
            req.headers["x-razorpay-signature"];


        const expectedSignature =
            crypto
                .createHmac(
                    "sha256",
                    process.env.RAZORPAY_WEBHOOK_SECRET
                )
                .update(req.body)
                .digest("hex");


        if (
            signature !==
            expectedSignature
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid webhook signature"

            });

        }


        const payload =
            JSON.parse(
                req.body.toString()
            );


        const event =
            payload.event;


        // =========================================
        // PAYMENT CAPTURED
        // =========================================

        if (
            event ===
            "payment.captured"
        ) {

            const payment =
                payload.payload
                    .payment.entity;


            const gatewayOrderId =
                payment.order_id;

            const gatewayPaymentId =
                payment.id;


            // =====================================
            // PAYMENT SESSION
            // =====================================

            const paymentSession =
                await PaymentSession.findOne({

                    gatewayOrderId

                });


            if (!paymentSession) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Payment session not found"

                });

            }


            // =====================================
            // TRANSACTION
            // =====================================

            const transaction =
                await PaymentTransaction.findOne({

                    paymentSession:
                        paymentSession._id

                });


            if (!transaction) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Payment transaction not found"

                });

            }


            // =====================================
            // IDEMPOTENCY
            // =====================================

            if (
                transaction.status ===
                "SUCCESS"
            ) {

                return res.status(200).json({

                    success: true,

                    message:
                        "Already processed"

                });

            }


            // =====================================
            // PAYMENT SUCCESS
            // =====================================

            paymentSession.status =
                "SUCCESS";

            paymentSession.gatewayPaymentId =
                gatewayPaymentId;

            paymentSession.gatewaySignature =
                signature;

            paymentSession.paidAt =
                new Date();

            paymentSession.gatewayResponse =
                payment;


            await paymentSession.save();


            transaction.status =
                "SUCCESS";

            transaction.gatewayPaymentId =
                gatewayPaymentId;

            transaction.gatewaySignature =
                signature;

            transaction.paidAt =
                new Date();

            transaction.gatewayResponse =
                payment;


            transaction.timeline.push({

                status:
                    "SUCCESS",

                message:
                    "Payment captured",

                createdAt:
                    new Date()

            });


            await transaction.save();


            // =====================================
            // GET ORDER THROUGH API
            // =====================================

            const orderResponse =
                await getOrder(
                    paymentSession.orderId
                );


            const order =
                orderResponse.order;


            if (!order) {

                throw new Error(
                    "Order not found"
                );

            }


            // =====================================
            // CONFIRM ORDER THROUGH API
            // =====================================

            await markOrderPaymentSuccess({

                orderId:
                    order._id,

                transactionId:
                    gatewayPaymentId,

                paymentProvider:
                    "RAZORPAY"

            });


            // =====================================
            // REDUCE STOCK THROUGH API
            // =====================================

            await reduceStock({

                orderId:
                    order._id,

                items:
                    order.items

            });


            // =====================================
            // CLEAR CART THROUGH API
            // =====================================

            await clearCart({

                userId:
                    order.user,

                orderId:
                    order._id

            });


            // =====================================
            // DONE
            // =====================================

            return res.status(200).json({

                success: true,

                message:
                    "Payment processed successfully"

            });

        }


        // =========================================
        // PAYMENT FAILED
        // =========================================

        if (
            event ===
            "payment.failed"
        ) {

            // PaymentSession update
            // PaymentTransaction update
            // Order Service API call

        }


        return res.status(200).json({

            success: true,

            message:
                "Webhook ignored"

        });

    }
    catch (error) {

        console.error(
            "Razorpay webhook error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                error.message

        });

    }
};