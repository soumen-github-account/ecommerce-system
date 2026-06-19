// import crypto from "crypto";

// import { Order } from "../models/OrderModel.js";
// import { Cart } from "../models/CartModel.js";
// import { Product } from "../models/ProductModel.js";
// import { PaymentSession } from "../models/PaymentSession.js";

// export const razorpayWebhook = async (req, res) => {
//   try {
//     console.log("Webhook Hit");

//     const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

//     const receivedSignature = req.headers["x-razorpay-signature"];

//     const expectedSignature = crypto
//       .createHmac("sha256", webhookSecret)
//       .update(req.body)
//       .digest("hex");

//     if (expectedSignature !== receivedSignature) {
//       console.log("Invalid Signature");

//       return res.status(400).json({
//         success: false,
//         message: "Invalid signature",
//       });
//     }

//     const payload = JSON.parse(req.body.toString());

//     const event = payload.event;

//     console.log("WEBHOOK EVENT:", event);

//     // ==================================
//     // PAYMENT CAPTURED
//     // ==================================

//     if (event === "payment.captured") {
//       const payment = payload.payload.payment.entity;

//       const gatewayOrderId = payment.order_id;

//       const gatewayPaymentId = payment.id;

//       // ==================================
//       // IDEMPOTENT UPDATE
//       // ==================================

//       const paymentSession = await PaymentSession.findOneAndUpdate(
//         {
//           gatewayOrderId,

//           status: {
//             $ne: "SUCCESS",
//           },
//         },

//         {
//           $set: {
//             status: "SUCCESS",

//             gatewayPaymentId,

//             paidAt: new Date(),
//           },
//         },

//         {
//           new: true,
//         },
//       );

//       // already processed
//       if (!paymentSession) {
//         return res.status(200).json({
//           success: true,

//           message: "Already processed",
//         });
//       }

//       const order = await Order.findById(paymentSession.orderId);

//       if (order) {
//         order.paymentStatus = "SUCCESS";

//         order.orderStatus = "CONFIRMED";

//         await order.save();

//         // =====================
//         // STOCK REDUCE
//         // =====================

//         for (const item of order.items) {
//           const updatedProduct = await Product.findOneAndUpdate(
//             {
//               _id: item.productId,

//               stock: {
//                 $gte: item.quantity,
//               },
//             },

//             {
//               $inc: {
//                 stock: -item.quantity,
//               },
//             },

//             {
//               new: true,
//             },
//           );

//           if (!updatedProduct) {
//             console.error(
//               "Stock deduction failed for product:",
//               item.productId,
//             );
//           }
//         }

//         // =====================
//         // CLEAR CART
//         // =====================

//         await Cart.deleteMany({
//           user: order.userId,
//         });
//       }
//     }

//     // ==================================
//     // PAYMENT FAILED
//     // ==================================

//     if (event === "payment.failed") {
//       const payment = payload.payload.payment.entity;

//       const gatewayOrderId = payment.order_id;

//       await PaymentSession.findOneAndUpdate(
//         {
//           gatewayOrderId,

//           status: {
//             $nin: ["SUCCESS", "FAILED"],
//           },
//         },

//         {
//           status: "FAILED",

//           failureReason: payment.error_description,
//         },
//       );

//       await Order.updateOne(
//         {
//           paymentSessionId: (
//             await PaymentSession.findOne({
//               gatewayOrderId,
//             })
//           )?._id,
//         },

//         {
//           paymentStatus: "FAILED",
//         },
//       );
//     }

//     return res.status(200).json({
//       success: true,
//     });
//   } catch (error) {
//     console.error("WEBHOOK ERROR:", error);

//     return res.status(500).json({
//       success: false,
//     });
//   }
// };


import mongoose from "mongoose";
import { Order } from "../models/OrderModel.js";
import { Cart } from "../models/CartModel.js";
import { Product } from "../models/ProductModel.js";
import { PaymentSession } from "../models/PaymentSession.js";

export const razorpayWebhook = async (req, res) => {
    console.log("Webhook Hit");

    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const receivedSignature = req.headers["x-razorpay-signature"];

    // 1. Signature Verification (Strict)
    const expectedSignature = crypto
        .createHmac("sha256", webhookSecret)
        .update(JSON.stringify(req.body)) // Ensure JSON string format
        .digest("hex");

    if (expectedSignature !== receivedSignature) {
        console.error("Invalid Webhook Signature");
        return res.status(400).json({ success: false, message: "Invalid signature" });
    }

    const payload = JSON.parse(req.body.toString());
    const event = payload.event;

    if (event === "payment.captured") {
        const payment = payload.payload.payment.entity;
        const gatewayOrderId = payment.order_id;
        const gatewayPaymentId = payment.id;

        const existingSession = await PaymentSession.findOne({ gatewayOrderId });
        if (existingSession && existingSession.status === "SUCCESS") {
            console.log("Duplicate Webhook received, skipping...");
            return res.status(200).json({ success: true, message: "Already processed" });
        }

        // Atomic Transaction Start
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            // Find session and lock it
            const paymentSession = await PaymentSession.findOne({ 
                gatewayOrderId, 
                status: { $ne: "SUCCESS" } 
            }).session(session);

            if (!paymentSession) {
                await session.abortTransaction();
                return res.status(200).json({ message: "Already processed" });
            }

            // Update Payment Session
            paymentSession.status = "SUCCESS";
            paymentSession.gatewayPaymentId = gatewayPaymentId;
            paymentSession.paidAt = new Date();
            await paymentSession.save({ session });

            // Update Order
            const order = await Order.findById(paymentSession.orderId).session(session);
            if (order) {
                order.paymentStatus = "SUCCESS";
                order.orderStatus = "CONFIRMED";
                await order.save({ session });

                // Reduce Stock & Clear Cart (Atomic)
                for (const item of order.items) {
                    const product = await Product.findById(item.productId).session(session);
                    if (!product || product.stock < item.quantity) {
                        throw new Error(`Insufficient stock for ${product?.name || item.productId}`);
                    }
                    product.stock -= item.quantity;
                    await product.save({ session });
                }

                await Cart.deleteMany({ user: order.userId }).session(session);
            }

            // Commit Transaction
            await session.commitTransaction();
            console.log("Transaction committed successfully");

        } catch (error) {
            // Rollback on any failure
            await session.abortTransaction();
            console.error("Transaction Aborted:", error);
            return res.status(500).json({ success: false, message: "Webhook processing failed" });
        } finally {
            session.endSession();
        }
    }
    
    // ... handle "payment.failed" similarly (but usually no need for heavy transaction here)
    return res.status(200).json({ success: true });
};