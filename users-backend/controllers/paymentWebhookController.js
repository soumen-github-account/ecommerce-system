
// import mongoose from "mongoose";
// import { Order } from "../models/OrderModel.js";
// import { Cart } from "../models/CartModel.js";
// import { Product } from "../models/ProductModel.js";
// import { PaymentSession } from "../models/PaymentSession.js";

// export const razorpayWebhook = async (req, res) => {
//     console.log("Webhook Hit");

//     const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
//     const receivedSignature = req.headers["x-razorpay-signature"];

//     // 1. Signature Verification (Strict)
//     const expectedSignature = crypto
//         .createHmac("sha256", webhookSecret)
//         .update(JSON.stringify(req.body)) // Ensure JSON string format
//         .digest("hex");

//     if (expectedSignature !== receivedSignature) {
//         console.error("Invalid Webhook Signature");
//         return res.status(400).json({ success: false, message: "Invalid signature" });
//     }

//     const payload = JSON.parse(req.body.toString());
//     const event = payload.event;

//     if (event === "payment.captured") {
//         const payment = payload.payload.payment.entity;
//         const gatewayOrderId = payment.order_id;
//         const gatewayPaymentId = payment.id;

//         const existingSession = await PaymentSession.findOne({ gatewayOrderId });
//         if (existingSession && existingSession.status === "SUCCESS") {
//             console.log("Duplicate Webhook received, skipping...");
//             return res.status(200).json({ success: true, message: "Already processed" });
//         }

//         // Atomic Transaction Start
//         const session = await mongoose.startSession();
//         session.startTransaction();

//         try {
//             // Find session and lock it
//             const paymentSession = await PaymentSession.findOne({ 
//                 gatewayOrderId, 
//                 status: { $ne: "SUCCESS" } 
//             }).session(session);

//             if (!paymentSession) {
//                 await session.abortTransaction();
//                 return res.status(200).json({ message: "Already processed" });
//             }

//             // Update Payment Session
//             paymentSession.status = "SUCCESS";
//             paymentSession.gatewayPaymentId = gatewayPaymentId;
//             paymentSession.paidAt = new Date();
//             await paymentSession.save({ session });

//             // Update Order
//             const order = await Order.findById(paymentSession.orderId).session(session);
//             if (order) {
//                 order.payment.status = "SUCCESS";
//                 order.payment.transactionId = gatewayPaymentId;
//                 order.payment.paymentProvider = "RAZORPAY";

//                 order.status = "CONFIRMED";

//                 await order.save({ session });

//                 // Reduce Stock & Clear Cart (Atomic)
//                 for (const item of order.items) {
//                     const product = await Product.findById(item.productId).session(session);
//                     if (!product || product.stock < item.quantity) {
//                         throw new Error(`Insufficient stock for ${product?.name || item.productId}`);
//                     }
//                     product.stock -= item.quantity;
//                     await product.save({ session });
//                 }

//                 await Cart.deleteMany({ user: order.userId }).session(session);
//             }

//             // Commit Transaction
//             await session.commitTransaction();
//             console.log("Transaction committed successfully");

//         } catch (error) {
//             // Rollback on any failure
//             await session.abortTransaction();
//             console.error("Transaction Aborted:", error);
//             return res.status(500).json({ success: false, message: "Webhook processing failed" });
//         } finally {
//             session.endSession();
//         }
//     }
    
//     // ... handle "payment.failed" similarly (but usually no need for heavy transaction here)
//     return res.status(200).json({ success: true });
// };

import crypto from "crypto";
import mongoose from "mongoose";

import { Order } from "../models/OrderModel.js";
import { PaymentSession } from "../models/PaymentSession.js";
import { Cart } from "../models/CartModel.js";
import { Product } from "../models/ProductModel.js";

export const razorpayWebhook = async (req, res) => {
console.log("Webhook Hit");

    const signature=req.headers["x-razorpay-signature"];

    const expected=crypto
        .createHmac(
            "sha256",
            process.env.RAZORPAY_WEBHOOK_SECRET
        )
        .update(req.body)
        .digest("hex");

    console.log("Signature =",signature);
    console.log("Expected =",expected);

    if(signature!==expected){

        return res.status(400).json({
            success:false,
            message:"Invalid Signature"
        });

    }

    const payload=JSON.parse(req.body.toString());

    console.log(payload);

    const event=payload.event;

    console.log(event);
    //----------------------------------------
    // PAYMENT SUCCESS
    //----------------------------------------

    if (event === "payment.captured") {

        const payment = payload.payload.payment.entity;
        const gatewayOrderId = payment.order_id;
        const gatewayPaymentId = payment.id;

        console.log(gatewayOrderId);
        console.log(gatewayPaymentId);

        const mongoSession = await mongoose.startSession();

        try {

            await mongoSession.startTransaction();

            const paymentSession =
                await PaymentSession.findOne({
                    gatewayOrderId
                }).session(mongoSession);

            if (!paymentSession) {

                await mongoSession.abortTransaction();

                return res.status(404).json({
                    success:false,
                    message:"Payment session not found"
                });

            }

            if (paymentSession.status === "SUCCESS") {

                await mongoSession.abortTransaction();

                return res.status(200).json({
                    success:true,
                    message:"Already processed"
                });

            }

            //------------------------------------
            // Payment Session
            //------------------------------------

            paymentSession.status = "SUCCESS";
            paymentSession.gatewayPaymentId = gatewayPaymentId;
            paymentSession.paidAt = new Date();

            await paymentSession.save({
                session:mongoSession
            });

            console.log("Payment Session =", paymentSession);

            //------------------------------------
            // Order
            //------------------------------------

            const order = await Order.findById(
                paymentSession.orderId
            ).session(mongoSession);

            console.log("Order =", order);

            if (!order) {

                throw new Error("Order not found");

            }

            order.payment.status = "SUCCESS";
            order.payment.transactionId = gatewayPaymentId;
            order.payment.paymentProvider = "RAZORPAY";

            order.status = "CONFIRMED";

            await order.save({
                session:mongoSession
            });

            //------------------------------------
            // Stock Reduce
            //------------------------------------

            for (const item of order.items) {

                const product =
                    await Product.findById(item.product)
                        .session(mongoSession);

                if (!product)
                    continue;

                // Agar variants me stock hai to baad me variant update karenge
            }

            //------------------------------------
            // Clear Cart
            //------------------------------------

            await Cart.deleteMany({
                user: order.user
            }).session(mongoSession);

            await mongoSession.commitTransaction();

            console.log("Payment Success");

            return res.status(200).json({
                success:true
            });

        }

        catch(err){
            console.error("WEBHOOK ERROR");
            console.error(err);
            console.error(err.stack);
            await mongoSession.abortTransaction();
            return res.status(500).json({
                success:false,
                message:err.message
            });
        }

        finally{

            mongoSession.endSession();

        }

    }

    //----------------------------------------
    // PAYMENT FAILED
    //----------------------------------------

    if(event==="payment.failed"){

        const payment = payload.payload.payment.entity;

        const paymentSession=
            await PaymentSession.findOne({
                gatewayOrderId:payment.order_id
            });

        if(paymentSession){

            paymentSession.status="FAILED";

            await paymentSession.save();

            const order=await Order.findById(
                paymentSession.orderId
            );

            if(order){

                order.payment.status="FAILED";

                await order.save();

            }

        }

        return res.status(200).json({
            success:true
        });

    }

    return res.status(200).json({
        success:true
    });

};