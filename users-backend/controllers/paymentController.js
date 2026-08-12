import mongoose from "mongoose";
import axios from "axios";
import { Order } from "../models/OrderModel.js";
import { PaymentSession } from "../models/PaymentSession.js";
import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";
import {razorpay} from "../config/razorpay.js"
import { Address } from "../models/AddressModel.js";
import { PaymentTransaction } from "../models/PaymentTransaction.js";
import { ProductVariant } from "../models/ProductVariant.js";
import { Product } from "../models/ProductModel.js";

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

        //----------------------------------------
        // Validate
        //----------------------------------------

        if (!items || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Cart is empty."
            });
        }

        //----------------------------------------
        // Address
        //----------------------------------------

        const address = await Address.findOne({
            _id: addressId,
            user: req.user._id
        });

        if (!address) {
            return res.status(404).json({
                success: false,
                message: "Address not found."
            });
        }

        //----------------------------------------
        // Order Number
        //----------------------------------------

        const orderNumber =
            "CB" +
            Date.now() +
            Math.floor(Math.random() * 1000);

        //----------------------------------------
        // Build Order Items
        //----------------------------------------

        const orderItems = [];

        for (const item of items) {

            //------------------------------------
            // Variant
            //------------------------------------

            const variant = await ProductVariant
                .findById(item.variant._id)
                .populate("product");

            if (!variant) {
                return res.status(404).json({
                    success: false,
                    message: "Variant not found."
                });
            }

            //------------------------------------
            // Product
            //------------------------------------

            const product = variant.product;

            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: "Product not found."
                });
            }

            //------------------------------------
            // Stock Check
            //------------------------------------

            if (variant.inventory.stock < item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `${product.title} is out of stock`
                });
            }

            //------------------------------------
            // Order Item
            //------------------------------------

            orderItems.push({

                seller: product.seller,

                product: product._id,

                variant: variant._id,

                sku: variant.sku,

                quantity: item.quantity,

                pricing: {

                    mrp: variant.pricing.mrp,

                    sellingPrice: variant.pricing.sellingPrice,

                    costPrice: variant.pricing.costPrice,

                    discount: variant.pricing.discount,

                    tax: variant.pricing.tax,

                    total:
                        variant.pricing.sellingPrice *
                        item.quantity
                },

                snapshot: {

                    title: product.title,

                    variantName: variant.variantName,

                    image:
                        variant.images?.find(
                            img => img.isPrimary
                        )?.url ||
                        variant.images?.[0]?.url,

                    attributes:
                        variant.attributes
                }

            });

        }

        //----------------------------------------
        // Create Order
        //----------------------------------------

        const order = await Order.create({

            orderNumber,

            user: req.user._id,

            items: orderItems,

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

        //----------------------------------------
        // Response
        //----------------------------------------

        return res.status(201).json({

            success: true,

            orderId: order._id,

            orderNumber: order.orderNumber

        });

    }

    catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }
};

export const createPaymentSession = async (req, res) => {
    const mongoSession = await mongoose.startSession();

    try {

        const userId = req.user._id;
        
        await mongoSession.startTransaction();

        const {
            orderId,
            paymentMethod,
            upiAppPackage
        } = req.body;

        //------------------------------------
        // Validate
        //------------------------------------

        if (!orderId) {

            return res.status(400).json({

                success: false,

                message: "Order Id is required"

            });

        }

        if (!paymentMethod) {

            return res.status(400).json({

                success: false,

                message: "Payment Method is required"

            });

        }

        //------------------------------------
        // Order
        //------------------------------------

        const order = await Order.findById(orderId).session(mongoSession);

        if (!order) {

            return res.status(404).json({

                success: false,

                message: "Order not found"

            });

        }

        //------------------------------------
        // Ownership
        //------------------------------------

        if (order.user.toString() !== userId.toString()) {

            return res.status(403).json({

                success: false,

                message: "Unauthorized order"

            });

        }

        //------------------------------------
        // Already Paid
        //------------------------------------

        if (order.payment.status === "SUCCESS") {

            return res.status(400).json({

                success: false,

                message: "Order already paid"

            });

        }

        //------------------------------------
        // Save Payment Method
        //------------------------------------

        order.payment.method =

            paymentMethod.toUpperCase();

        await order.save({session: mongoSession});

        const amount =

            order.pricing.totalAmount;

        //------------------------------------
        // COD
        //------------------------------------

        if (paymentMethod === "COD") {

            const [paymentSession] = await PaymentSession.create(
                [{
                    sessionId: uuidv4(),
                    userId,
                    orderId: order._id,
                    amount,
                    currency: "INR",
                    paymentMethod: "COD",
                    provider: "COD",
                    status: "CREATED"
                }],
                { session: mongoSession }
            );

            await PaymentTransaction.create([{

                user: userId,

                order: order._id,

                paymentSession: paymentSession._id,

                gateway: "COD",

                amount,

                currency: "INR",

                paymentMethod: "COD",

                status: "PENDING",

                timeline: [

                    {

                        status: "PENDING",

                        message:
                            "Cash on Delivery selected"

                    }

                ]

            }], {session: mongoSession});
            await mongoSession.commitTransaction();

            return res.status(200).json({

                success: true,

                paymentSessionId: paymentSession.sessionId,

                orderId: order._id,

                paymentData: null,

                merchantUpiId: null

            });

        }

        //------------------------------------
        // ONLINE PAYMENT
        //------------------------------------

        // NEXT PART
                //------------------------------------
        // Remove Old Created Sessions
        //------------------------------------

        // await PaymentSession.deleteMany({

        //     orderId: order._id,

        //     status: "CREATED"

        // }, {session: mongoSession});

        // await PaymentTransaction.deleteMany({

        //     order: order._id,

        //     status: "CREATED"

        // }, {session: mongoSession});

        //------------------------------------
        // Create Razorpay Order
        //------------------------------------

        //------------------------------------
        // Get Last Payment Session
        //------------------------------------

        const lastSession =
        await PaymentSession
        .findOne({
            orderId: order._id
        })
        .sort({createdAt:-1})
        .session(mongoSession);

        let retryCount = 0;

        if(lastSession){

            retryCount =
                (lastSession.retryCount || 0) + 1;

        }

        const razorpayOrder =
            await razorpay.orders.create({

                amount: Math.round(amount * 100),

                currency: "INR",

                receipt: order.orderNumber,

                notes: {

                    orderId:
                        order._id.toString(),

                    orderNumber:
                        order.orderNumber,

                    userId:
                        userId.toString()

                }

            });

        //------------------------------------
        // Create Payment Session
        //------------------------------------

        const [paymentSession] = await PaymentSession.create(
            [{
                sessionId: uuidv4(),
                userId,
                orderId: order._id,
                amount,
                currency: "INR",
                paymentMethod,
                provider: "RAZORPAY",
                upiAppPackage,
                gatewayOrderId: razorpayOrder.id,
                status: "CREATED",
                retryCount,
                expiresAt: new Date(Date.now() + 15 * 60 * 1000)
            }],
            { session: mongoSession }
        );

        //------------------------------------
        // Create Payment Transaction
        //------------------------------------

        await PaymentTransaction.create([{

            user: userId,

            order: order._id,

            paymentSession: paymentSession._id,

            gateway: "RAZORPAY",

            gatewayOrderId:
                razorpayOrder.id,

            gatewayPaymentId: null,

            amount,

            currency: "INR",

            paymentMethod,

            status: "CREATED",

            timeline: [

                {

                    status: "CREATED",

                    message:
                        "Payment session created"

                }

            ]

        }], {session: mongoSession});

        //------------------------------------
        // NEXT PART
        //------------------------------------
                //------------------------------------
        // Response
        //------------------------------------

        await mongoSession.commitTransaction();

        return res.status(201).json({

            success: true,

            paymentSessionId: paymentSession.sessionId,

            orderId:
                order._id,

            paymentData: {

                gatewayOrderId:
                    razorpayOrder.id,

                amount:
                    razorpayOrder.amount,

                currency:
                    razorpayOrder.currency

            },

            merchantUpiId:
                process.env.UPI_ID || null

        });

    }

    catch (error) {
        await mongoSession.abortTransaction();

        console.error(
            "CREATE PAYMENT SESSION ERROR"
        );

        console.error(error);

        return res.status(500).json({

            success: false,

            message:
                error.message

        });

    } finally{
        mongoSession.endSession();
    }

};

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

                    // Payment id bhi fetch kar lo
                    const payments = await razorpay.orders.fetchPayments(
                        paymentSession.gatewayOrderId
                    );

                    if (payments.items.length > 0) {

                        const payment = payments.items[0];

                        paymentSession.gatewayPaymentId = payment.id;

                        order.payment.transactionId = payment.id;
                        order.payment.paymentProvider = "RAZORPAY";
                    }

                    await paymentSession.save();

                    order.payment.status = "SUCCESS";
                    order.status = "CONFIRMED";

                    await order.save();

                    // Cart clear
                    await Cart.deleteMany({
                        user: order.user
                    });
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

