
import axios from "axios";
import { Order } from "../models/OrderModel.js";
import { PaymentSession } from "../models/PaymentSession.js";
import crypto from "crypto";


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
            addressId,              // ✅ FIX
            paymentMethod,          // ✅ FIX
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

        const { orderId } = req.body;

        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        const response = await axios.post(
            "https://api.cashfree.com/pg/orders",
            {
                order_id: order._id.toString(),
                order_amount: order.totalAmount,
                order_currency: "INR",

                customer_details: {
                    customer_id: order.userId.toString(),
                    customer_name: "Test User",
                    customer_email: "test@example.com",
                    customer_phone: "7584818990"
                }
            },
            {
                headers: {
                    "x-client-id": process.env.CASHFREE_CLIENT_ID,
                    "x-client-secret": process.env.CASHFREE_CLIENT_SECRET,
                    "x-api-version": "2023-08-01",
                    "Content-Type": "application/json"
                }
            }
        );

        console.log("Cashfree Response:");
        console.log(response.data);
        console.log("CF ORDER =", response.data.cf_order_id);
        console.log("SESSION ID =", response.data.payment_session_id);
        const session = await PaymentSession.create({
            orderId: order._id,

            cashfreeOrderId:
                response.data.cf_order_id,

            paymentSessionId:
                response.data.payment_session_id,

            amount: order.totalAmount,

            status: "CREATED"
        });

        order.paymentSessionId = session._id;
        await order.save();
        console.log(
            "cf_order_id =",
            response.data.cf_order_id
        );

        console.log(
            "payment_session_id =",
            response.data.payment_session_id
        );

        res.json({
            success: true,

            orderId:
                order._id.toString(),

            paymentSessionId: response.data.payment_session_id
        });

    } catch (error) {

        console.log("CREATE SESSION ERROR");

        if (error.response) {
            console.log(error.response.data);
        } else {
            console.log(error);
        }

        res.status(500).json({
            success: false,
            message: error.response?.data || error.message
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