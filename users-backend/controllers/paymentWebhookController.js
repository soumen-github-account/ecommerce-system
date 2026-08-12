
import crypto from "crypto";
import mongoose from "mongoose";

import { Order } from "../models/OrderModel.js";
import { PaymentSession } from "../models/PaymentSession.js";
import { PaymentTransaction } from "../models/PaymentTransaction.js";
import { Cart } from "../models/CartModel.js";
import { Product } from "../models/ProductModel.js";

export const razorpayWebhook = async (req, res) => {

    console.log("========== RAZORPAY WEBHOOK ==========");

    //---------------------------------------------------
    // Verify Signature
    //---------------------------------------------------

    const signature =
        req.headers["x-razorpay-signature"];

    const expectedSignature = crypto
        .createHmac(
            "sha256",
            process.env.RAZORPAY_WEBHOOK_SECRET
        )
        .update(req.body)
        .digest("hex");

    if (signature !== expectedSignature) {

        console.log("Invalid Webhook Signature");

        return res.status(400).json({

            success: false,

            message: "Invalid webhook signature"

        });

    }

    //---------------------------------------------------
    // Payload
    //---------------------------------------------------

    const payload =
        JSON.parse(req.body.toString());

    const event =
        payload.event;

    console.log("Webhook Event =", event);

    //---------------------------------------------------
    // PAYMENT CAPTURED
    //---------------------------------------------------

    if (event === "payment.captured") {

        const payment =
            payload.payload.payment.entity;

        const gatewayOrderId =
            payment.order_id;

        const gatewayPaymentId =
            payment.id;

        const mongoSession =
            await mongoose.startSession();

        try {

            await mongoSession.startTransaction();

            //------------------------------------
            // Payment Session
            //------------------------------------

            const paymentSession =
                await PaymentSession.findOne({

                    gatewayOrderId

                }).session(mongoSession);

            if (!paymentSession) {

                await mongoSession.abortTransaction();

                return res.status(404).json({

                    success: false,

                    message: "Payment Session not found"

                });

            }

            //------------------------------------
            // Payment Transaction
            //------------------------------------

            const paymentTransaction =
                await PaymentTransaction.findOne({

                    paymentSession:
                        paymentSession._id

                }).session(mongoSession);
                console.log("PaymentSession =", paymentSession?._id);
                console.log("PaymentTransaction =", paymentTransaction);

            if (!paymentTransaction) {

                throw new Error(
                    "Payment Transaction not found"
                );

            }

            //------------------------------------
            // Idempotency
            //------------------------------------

            if (
                paymentSession.status === "SUCCESS" &&
                paymentTransaction.status === "SUCCESS"
            ) {

                await mongoSession.abortTransaction();

                return res.status(200).json({

                    success: true,

                    message:
                        "Already processed"

                });

            }

            //-------------------------------------------------
            // NEXT PART
            // PaymentSession Update
            // PaymentTransaction Update
            // Order Update
            // Stock Update
            // Cart Clear
            //-------------------------------------------------
                        //------------------------------------
            // Update Payment Session
            //------------------------------------

            paymentSession.status = "SUCCESS";

            paymentSession.gatewayPaymentId =
                gatewayPaymentId;

            paymentSession.gatewaySignature =
                signature;

            paymentSession.paidAt =
                new Date();

            paymentSession.gatewayResponse = {

                entity: payment.entity,

                amount: payment.amount,

                currency: payment.currency,

                status: payment.status,

                method: payment.method,

                bank: payment.bank,

                wallet: payment.wallet,

                vpa: payment.vpa,

                email: payment.email,

                contact: payment.contact,

                fee: payment.fee,

                tax: payment.tax,

                rrn: payment.acquirer_data?.rrn,

                utr: payment.acquirer_data?.upi_transaction_id,

                acquirerData: payment.acquirer_data,

                notes: payment.notes,

                createdAt: payment.created_at

            };

            await paymentSession.save({

                session: mongoSession

            });

            //------------------------------------
            // Update Payment Transaction
            //------------------------------------

            paymentTransaction.status = "SUCCESS";

            paymentTransaction.gatewayPaymentId =
                gatewayPaymentId;

            paymentTransaction.gatewaySignature =
                signature;

            paymentTransaction.paidAt =
                new Date();

            paymentTransaction.gatewayResponse =
                payment;

            paymentTransaction.timeline.push({

                status: "SUCCESS",

                message: "Payment captured successfully.",

                createdAt: new Date()

            });

            await paymentTransaction.save({

                session: mongoSession

            });

            //------------------------------------
            // Update Order
            //------------------------------------

            const order =
                await Order.findById(
                    paymentSession.orderId
                ).session(mongoSession);

            if (!order) {

                throw new Error(
                    "Order not found"
                );

            }

            order.payment.status = "SUCCESS";

            order.payment.transactionId =
                gatewayPaymentId;

            order.payment.paymentProvider =
                "RAZORPAY";

            order.status = "CONFIRMED";

            await order.save({

                session: mongoSession

            });

            //------------------------------------
            // Reduce Stock
            //------------------------------------

            for (const item of order.items) {

                const product =
                    await Product.findById(
                        item.product
                    ).session(mongoSession);

                if (!product)
                    continue;

                // Variant stock update
                // Next phase me karenge
            }

            //------------------------------------
            // Clear Cart
            //------------------------------------

            await Cart.deleteMany({

                user: order.user

            }).session(mongoSession);

            //------------------------------------
            // Commit Transaction
            //------------------------------------

            await mongoSession.commitTransaction();

            console.log(
                "Payment Captured Successfully"
            );

            return res.status(200).json({

                success: true

            });

        }

        catch (err) {

            await mongoSession.abortTransaction();

            console.error(err);

            return res.status(500).json({

                success: false,

                message: err.message

            });

        }

        finally {

            mongoSession.endSession();

        }

    }

    //-------------------------------------------------
    // NEXT PART
    // payment.failed
    // refund.processed
    // refund.failed
    // default response
    //-------------------------------------------------
        //---------------------------------------------------
    // PAYMENT FAILED
    //---------------------------------------------------

    if (event === "payment.failed") {

        const payment =
            payload.payload.payment.entity;

        const paymentSession =
            await PaymentSession.findOne({

                gatewayOrderId:
                    payment.order_id

            });

        if (paymentSession) {

            paymentSession.status = "FAILED";

            paymentSession.failureReason =
                payment.error_description ||
                payment.error_reason ||
                "Payment Failed";

            paymentSession.gatewayResponse = payment;

            await paymentSession.save();

            const paymentTransaction =
                await PaymentTransaction.findOne({

                    paymentSession:
                        paymentSession._id

                });

            if (paymentTransaction) {

                paymentTransaction.status =
                    "FAILED";

                paymentTransaction.failureReason =
                    payment.error_description ||
                    payment.error_reason ||
                    "Payment Failed";

                paymentTransaction.failedAt =
                    new Date();

                paymentTransaction.gatewayResponse =
                    payment;

                paymentTransaction.timeline.push({

                    status: "FAILED",

                    message:
                        payment.error_description ||
                        payment.error_reason ||
                        "Payment Failed",

                    createdAt: new Date()

                });

                await paymentTransaction.save();

            }

            const order =
                await Order.findById(
                    paymentSession.orderId
                );

            if (order) {

                order.payment.status =
                    "FAILED";

                await order.save();

            }

        }

        return res.status(200).json({

            success: true

        });

    }

    //---------------------------------------------------
    // REFUND PROCESSED
    //---------------------------------------------------

    if (event === "refund.processed") {

        const refund =
            payload.payload.refund.entity;

        const transaction =
            await PaymentTransaction.findOne({

                gatewayPaymentId:
                    refund.payment_id

            });

        if (transaction) {

            transaction.refund.status =
                "PROCESSED";

            transaction.refund.refundId =
                refund.id;

            transaction.refund.amount =
                refund.amount / 100;

            transaction.refund.processedAt =
                new Date();

            if (!transaction.timeline) {
                transaction.timeline = [];
            }

            transaction.timeline.push({
                status: "REFUND_PROCESSED",
                message: "Refund completed",
                createdAt: new Date()
            });

            await transaction.save();

        }

        return res.status(200).json({

            success: true

        });

    }

    //---------------------------------------------------
    // REFUND FAILED
    //---------------------------------------------------

    if (event === "refund.failed") {

        const refund =
            payload.payload.refund.entity;

        const transaction =
            await PaymentTransaction.findOne({

                gatewayPaymentId:
                    refund.payment_id

            });

        if (transaction) {

            transaction.refund.status =
                "FAILED";

            transaction.refund.refundId =
                refund.id;

            transaction.refund.failureReason =
                refund.notes?.reason ||
                "Refund Failed";

            if (!transaction.timeline) {
                transaction.timeline = [];
            }

            transaction.timeline.push({
                status: "REFUND_FAILED",
                message:
                    transaction.refund.failureReason,
                createdAt: new Date()
            });

            await transaction.save();

        }

        return res.status(200).json({

            success: true

        });

    }

    //---------------------------------------------------
    // Ignore Other Events
    //---------------------------------------------------

    return res.status(200).json({

        success: true,

        message: "Webhook ignored"

    });

};
