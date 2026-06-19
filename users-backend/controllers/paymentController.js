import mongoose from "mongoose";
import axios from "axios";
import { Order } from "../models/OrderModel.js";
import { PaymentSession } from "../models/PaymentSession.js";
import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";
import {razorpay} from "../config/razorpay.js"


export const getRazorpayConfig = async (req, res) => {
    try {
        res.json({
            success: true,
            razorpayKey: process.env.RAZORPAY_KEY_ID
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const createOrder = async (req, res) => {
    try {
        const {
            items,
            totalAmount,
            addressId,
            paymentMethod
        } = req.body;

        if (!items || !items.length) {
            return res.status(400).json({
                success: false,
                message: "Items required"
            });
        }

        const order = await Order.create({
            userId: req.user.id,
            items,
            totalAmount,
            addressId,
            paymentMethod,   
            orderStatus: "INITIATED",
            paymentStatus: "PENDING"
        });

        return res.status(201).json({
            success: true,
            orderId: order._id
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const createPaymentSession = async (req, res) => {
    try {

        const userId = req.user.id;

        const { orderId, addressId, paymentMethod, upiAppPackage } = req.body;

        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        // 🔥 1. Create Razorpay Order FIRST
        const razorpayOrder = await razorpay.orders.create({
            amount: order.totalAmount * 100,
            currency: "INR",
            receipt: order._id.toString()
        });

        if (!razorpayOrder) {
            return res.status(500).json({
                success: false,
                message: "Failed to create Razorpay order"
            });
        }

        // 🔥 2. Create Payment Session
        const session = await PaymentSession.create({
            sessionId: uuidv4(),
            userId,
            orderId: order._id,
            amount: order.totalAmount,
            currency: "INR",
            paymentMethod,
            upiAppPackage,
            gatewayOrderId: razorpayOrder.id, 
            status: "CREATED"
        });

        order.paymentSessionId = session._id;
        await order.save();

        return res.status(201).json({
            success: true,

            paymentSessionId: session._id,
            orderId: order._id,

            paymentData: {
                gatewayOrderId: razorpayOrder.id,
                amount: order.totalAmount * 100,
                currency: "INR"
            },

            merchantUpiId: process.env.UPI_ID || null
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const cashfreeWebhook = async (req, res) => {
    try {
        const signature = req.headers["x-webhook-signature"];
        const timestamp = req.headers["x-webhook-timestamp"];
        const rawBody = JSON.stringify(req.body);

        // Verify Signature (Use your Cashfree Secret Key)
        const bodyToVerify = timestamp + rawBody;
        const expectedSignature = crypto
            .createHmac("sha256", process.env.CASHFREE_SECRET_KEY)
            .update(bodyToVerify)
            .digest("base64");

        if (signature !== expectedSignature) {
            return res.status(401).send("Invalid Signature");
        }

        // Proceed with your logic
        const event = req.body;
        if (event.type === "PAYMENT_SUCCESS_WEBHOOK") {
            const cfOrderId = event.data.order.order_id;

        const paymentSession =
            await PaymentSession.findOne({
                cashfreeOrderId: cfOrderId
            });

        if (!paymentSession) {
            return res.status(404).send("Session not found");
        }

        await PaymentSession.findByIdAndUpdate(
            paymentSession._id,
            {
                status: "SUCCESS"
            }
        );

        await Order.findByIdAndUpdate(
            paymentSession.orderId,
            {
                paymentStatus: "SUCCESS",
                orderStatus: "CONFIRMED"
            }
        );
                    
        }
        res.status(200).send("OK");
    } catch (error) {
        res.status(500).send();
    }
};


export const getPaymentStatus = async (req, res) => {
    try {
        // const { orderId } = req.params;
        // const order = await Order.findById(orderId);
        
        // if (!order) return res.status(404).json({ success: false });
        
        const { sessionId } = req.params;
        let session = await PaymentSession.findOne({ sessionId });

        // Agar session PENDING hai, toh Razorpay API se confirm karo
        if (session.status === "PENDING") {
            const razorpayOrder = await razorpay.orders.fetch(session.gatewayOrderId);
            // Razorpay logic: check razorpayOrder.status
            if (razorpayOrder.status === 'paid') {
                session.status = "SUCCESS";
                await session.save();
                // Trigger stock deduction logic here (ensure it runs only once!)
            }
        }

        res.json({
            success: true,
            orderStatus: order.orderStatus, // "CONFIRMED" or "PENDING_PAYMENT"
            paymentStatus: order.paymentStatus
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};