import mongoose from "mongoose";
import axios from "axios";
import { Order } from "../models/OrderModel.js";
import { PaymentSession } from "../models/PaymentSession.js";
import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";
import {razorpay} from "../config/razorpay.js"
import { Address } from "../models/AddressModel.js";

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


// export const createOrder = async (req, res) => {
//     try {

//         const {
//             items,
//             totalAmount,
//             addressId,
//             paymentMethod
//         } = req.body;

//         if (!items || items.length === 0) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Cart is empty."
//             });
//         }

//         // Shipping Address
//         let shippingAddress = {};

//         if (addressId) {

//             const address = await Address.findOne({
//                 _id: addressId,
//                 user: req.user._id
//             });

//             if (!address) {
//                 return res.status(404).json({
//                     success: false,
//                     message: "Address not found."
//                 });
//             }

//             shippingAddress = {
//                 fullName: address.fullName,
//                 phone: address.phone,
//                 addressLine1: address.addressLine1,
//                 addressLine2: address.addressLine2,
//                 landmark: address.landmark,
//                 city: address.city,
//                 state: address.state,
//                 country: address.country,
//                 pincode: address.pincode
//             };
//         }

//         // Unique Order Number
//         const orderNumber =
//             "CB" +
//             Date.now() +
//             Math.floor(Math.random() * 1000);

//         const order = await Order.create({

//             orderNumber,

//             user: req.user._id,

//             items: items.map(item => ({

//                 product: item.product._id,

//                 variant: item.variant._id,

//                 sku: item.variant.sku,

//                 quantity: item.quantity,

//                 pricing: {
//                     mrp: item.mrp,
//                     sellingPrice: item.price,
//                     total: item.price * item.quantity
//                 },

//                 snapshot: {
//                     title: item.product.title,
//                     variantName: item.variant.variantName,
//                     image: item.image,
//                     attributes: item.variant.attributes
//                 }

//             })),

//             shippingAddress,

//             pricing: {
//                 subtotal: totalAmount,
//                 discount: 0,
//                 shippingCharge: 0,
//                 tax: 0,
//                 totalAmount
//             },

//             payment: {
//                 method: paymentMethod || "UPI",
//                 status: "PENDING"
//             },

//             status: "PLACED"

//         });

//         return res.status(201).json({

//             success: true,
//             orderId: order._id,
//             orderNumber: order.orderNumber

//         });

//     } catch (e) {

//         console.log(e);

//         return res.status(500).json({
//             success: false,
//             message: e.message
//         });

//     }
// };

export const createOrder = async (req, res) => {

    try {

        const {

            items,

            totalAmount,

            addressId,

            paymentMethod

        } = req.body;

        if (!items || items.length === 0) {

            return res.status(400).json({

                success: false,

                message: "Cart is empty."

            });

        }

        const address = await Address.findOne({

            _id: addressId,

            user: req.user._id

        });

        if (!address) {

            return res.status(404).json({

                success: false,

                message: "Address not found"

            });

        }

        const orderNumber =

            "CB" +

            Date.now() +

            Math.floor(Math.random() * 1000);

        const order = await Order.create({

            orderNumber,

            user: req.user._id,

            items: items.map(item => ({

                product: item.product._id,

                variant: item.variant._id,

                sku: item.variant.sku,

                quantity: item.quantity,

                pricing: {

                    mrp: item.mrp,

                    sellingPrice: item.price,

                    costPrice: item.costPrice || 0,

                    discount: item.discount || 0,

                    tax: item.tax || 0,

                    total: item.price * item.quantity

                },

                snapshot: {

                    title: item.product.title,

                    variantName: item.variant.variantName,

                    image: item.image,

                    attributes: item.variant.attributes

                }

            })),

            shippingAddress: {

                fullName: address.fullName,

                phone: address.phone,

                addressLine1: address.addressLine1,

                addressLine2: address.addressLine2,

                landmark: address.landmark,

                city: address.city,

                state: address.state,

                country: address.country,

                pincode: address.pincode

            },

            pricing: {

                subtotal: totalAmount,

                discount: 0,

                shippingCharge: 0,

                tax: 0,

                totalAmount

            },

            payment: {

                method: paymentMethod,

                status: "PENDING"

            },

            status: "PLACED"

        });

        return res.status(201).json({

            success: true,

            orderId: order._id,

            orderNumber: order.orderNumber

        });

    }

    catch (error) {

        console.log(error);

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// export const createPaymentSession = async (req, res) => {
//     try {

//         const userId = req.user.id;
//         const { orderId, addressId, paymentMethod, upiAppPackage } = req.body;

//         const order = await Order.findById(orderId);

//         if (!order) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Order not found"
//             });
//         }

//         // ✅ Total amount nikalo
//         const amount = order.pricing.totalAmount;

//         console.log("Amount =", amount);

//         // ✅ Razorpay Order Create
//         const razorpayOrder = await razorpay.orders.create({
//             amount: Math.round(amount * 100), // paise
//             currency: "INR",
//             receipt: order.orderNumber
//         });

//         console.log("Razorpay Order =", razorpayOrder);

//         // ✅ Payment Session
//         const session = await PaymentSession.create({
//             sessionId: uuidv4(),
//             userId,
//             orderId: order._id,
//             amount,
//             currency: "INR",
//             paymentMethod,
//             upiAppPackage,
//             gatewayOrderId: razorpayOrder.id,
//             status: "CREATED"
//         });

//         return res.status(201).json({
//             success: true,

//             paymentSessionId: session._id,
//             orderId: order._id,

//             paymentData: {
//                 gatewayOrderId: razorpayOrder.id,
//                 amount: razorpayOrder.amount,
//                 currency: razorpayOrder.currency
//             },

//             merchantUpiId: process.env.UPI_ID || null
//         });

//     } catch (error) {
//         console.error(error);

//         return res.status(500).json({
//             success: false,
//             message: error.message
//         });
//     }
// };


export const createPaymentSession = async (req, res) => {
    try {

        const userId = req.user._id;

        const {
            orderId,
            paymentMethod,
            upiAppPackage
        } = req.body;

        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        // Order ownership check
        if (order.user.toString() !== userId.toString()) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized order"
            });
        }

        // Already paid?
        if (order.payment.status === "SUCCESS") {
            return res.status(400).json({
                success: false,
                message: "Order already paid."
            });
        }

        // Update selected payment method
        order.payment.method = paymentMethod;
        await order.save();

        const amount = order.pricing.totalAmount;

        // ===========================
        // COD
        // ===========================

        if (paymentMethod === "COD") {

            const session = await PaymentSession.create({

                sessionId: uuidv4(),

                userId,

                orderId: order._id,

                amount,

                currency: "INR",

                paymentMethod: "COD",

                status: "CREATED"

            });

            return res.status(200).json({

                success: true,

                paymentSessionId: session.sessionId,

                orderId: order._id,

                paymentData: null,

                merchantUpiId: null

            });

        }

        // ===========================
        // ONLINE PAYMENT
        // ===========================

        const razorpayOrder = await razorpay.orders.create({

            amount: Math.round(amount * 100),

            currency: "INR",

            receipt: order.orderNumber,

            notes: {

                orderId: order._id.toString(),

                userId: userId.toString()

            }

        });
        
        await PaymentSession.deleteMany({
            orderId: order._id,
            status: "CREATED"
        });

        const session = await PaymentSession.create({

            sessionId: uuidv4(),

            userId,

            orderId: order._id,

            amount,

            currency: "INR",

            paymentMethod,

            upiAppPackage,

            gatewayOrderId: razorpayOrder.id,

            status: "CREATED"

        });

        return res.status(201).json({

            success: true,

            paymentSessionId: session.sessionId,

            orderId: order._id,

            paymentData: {

                gatewayOrderId: razorpayOrder.id,

                amount: razorpayOrder.amount,

                currency: razorpayOrder.currency

            },

            merchantUpiId: process.env.UPI_ID || null

        });

    }

    catch (error) {

        console.log(error);

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }
};

// export const getPaymentStatus = async (req, res) => {
//     try {
//         // const { orderId } = req.params;
//         // const order = await Order.findById(orderId);
        
//         // if (!order) return res.status(404).json({ success: false });
        
//         const { sessionId } = req.params;
//         let session = await PaymentSession.findOne({ sessionId });

//         // Agar session PENDING hai, toh Razorpay API se confirm karo
//         if (session.status === "PENDING") {
//             const razorpayOrder = await razorpay.orders.fetch(session.gatewayOrderId);
//             // Razorpay logic: check razorpayOrder.status
//             if (razorpayOrder.status === 'paid') {
//                 session.status = "SUCCESS";
//                 await session.save();
//                 // Trigger stock deduction logic here (ensure it runs only once!)
//             }
//         }

//         res.json({
//             success: true,
//             orderStatus: order.orderStatus, // "CONFIRMED" or "PENDING_PAYMENT"
//             paymentStatus: order.paymentStatus
//         });
//     } catch (error) {
//         res.status(500).json({ success: false, message: error.message });
//     }
// };

export const getPaymentStatus = async (req, res) => {
    try {

        const { sessionId } = req.params;

        const paymentSession = await PaymentSession.findOne({
            sessionId
        });

        if (!paymentSession) {
            return res.status(404).json({
                success: false,
                message: "Payment session not found"
            });
        }

        const order = await Order.findById(
            paymentSession.orderId
        );

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        // ---------------------------------
        // Optional Safety Check
        // Agar webhook delay ho to Razorpay se verify kar lo
        // ---------------------------------

        if (
            paymentSession.gatewayOrderId &&
            paymentSession.status !== "SUCCESS"
        ) {

            try {

                const razorpayOrder =
                    await razorpay.orders.fetch(
                        paymentSession.gatewayOrderId
                    );

                if (razorpayOrder.status === "paid") {

                    paymentSession.status = "SUCCESS";
                    paymentSession.paidAt = new Date();

                    await paymentSession.save();

                    order.payment.status = "SUCCESS";
                    order.status = "CONFIRMED";

                    await order.save();

                }

            } catch (e) {
                console.log("Razorpay Verify Error", e.message);
            }

        }

        return res.json({

            success: true,

            orderId: order._id,

            orderNumber: order.orderNumber,

            orderStatus: order.status,

            paymentStatus: order.payment.status,

            paymentMethod: order.payment.method,

            paymentSessionStatus: paymentSession.status

        });

    }

    catch (error) {

        console.log(error);

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }
};

