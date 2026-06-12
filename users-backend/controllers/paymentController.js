import Razorpay from "razorpay";
import { Order } from "../models/OrderModel.js";
import { Product } from "../models/ProductModel.js";
import { Cart } from "../models/CartModel.js";
import { generateSessionId } from "../utils/generateSessionId.js";
import { PaymentSession } from "../models/PaymentSession.js";
import { Address } from "../models/AddressModel.js";
import { processPaymentMethod } from "../services/paymentDecisionService.js";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

export const createPaymentSession = async (req, res) => {
try {
    console.log(
        "CREATE PAYMENT SESSION API HIT"
    );

    const userId = req.user.id;

    const {
        addressId,
        paymentMethod,
        upiAppPackage
    } = req.body;

    // ==========================
    // VALIDATE PAYMENT METHOD
    // ==========================

    const allowedMethods = [
        "UPI",
        "CARD",
        "COD"
    ];

    if (
        !allowedMethods.includes(
            paymentMethod
        )
    ) {

        return res.status(400).json({

            success: false,
            message: "Invalid payment method"
        });
    }

    // ==========================
    // CHECK EXISTING ACTIVE SESSION
    // ==========================

    const existingSession =
        await PaymentSession.findOne({

            userId,

            status: {
                $in: [
                    "CREATED",
                    "PENDING"
                ]
            },

            expiresAt: {
                $gt: new Date()
            }
        });

    if (existingSession) {

        return res.status(200).json({

            success: true,
            reused: true,

            orderId:
                existingSession.orderId,

            paymentSessionId:
                existingSession.sessionId,

            paymentMethod:
                existingSession.paymentMethod,

            paymentData: {

                gatewayOrderId:
                    existingSession.gatewayOrderId,

                amount:
                    existingSession.amount * 100,

                currency:
                    existingSession.currency
            },

            merchantUpiId:
                process.env.UPI_ID,

            razorpayKey:
                process.env.RAZORPAY_KEY_ID
        });
    }

    // ==========================
    // VALIDATE ADDRESS
    // ==========================

    const address =
        await Address.findOne({

            _id: addressId,
            user: userId
        });

    if (!address) {

        return res.status(404).json({

            success: false,
            message: "Address not found"
        });
    }

    // ==========================
    // LOAD CART
    // ==========================

    const cartItems =
        await Cart.find({
            user: userId
        }).populate(
            "product"
        );

    if (
        !cartItems ||
        cartItems.length === 0
    ) {

        return res.status(400).json({

            success: false,
            message: "Cart is empty"
        });
    }

    // ==========================
    // CALCULATE AMOUNT
    // ==========================

    let totalAmount = 0;

    const orderItems = [];

    for (const item of cartItems) {

        if (
            !item.product ||
            !item.product.price ||
            item.product.price.length === 0
        ) {
            continue;
        }

        // ==========================
        // STOCK VALIDATION
        // ==========================

        if (
            item.product.stock <
            item.quantity
        ) {

            return res.status(400).json({

                success: false,

                message:
                    `${item.product.name} is out of stock`
            });
        }

        const selectedPrice =
            item.product.price[0];

        totalAmount +=
            selectedPrice *
            item.quantity;

        orderItems.push({

            productId:
                item.product._id,

            quantity:
                item.quantity,

            price:
                selectedPrice,

            variantId:
                item.varient
        });
    }

    if (
        orderItems.length === 0
    ) {

        return res.status(400).json({

            success: false,
            message: "No valid products found"
        });
    }

    // ==========================
    // CREATE ORDER
    // ==========================

    const order =
        await Order.create({

            userId,

            items:
                orderItems,

            addressId,

            totalAmount,

            paymentMethod,

            paymentStatus:
                "PENDING",

            orderStatus:
                "INITIATED"
        });

    // ==========================
    // CREATE SESSION
    // ==========================

    const sessionId =
        generateSessionId();

    const paymentSession =
        await PaymentSession.create({

            sessionId,

            userId,

            orderId:
                order._id,

            amount:
                totalAmount,

            paymentMethod,

            upiAppPackage,

            status:
                "CREATED"
        });

    order.paymentSessionId =
        paymentSession._id;

    await order.save();

    // ==========================
    // CREATE GATEWAY ORDER
    // ==========================

    let paymentData;

    try {

        paymentData =
            await processPaymentMethod({

                paymentMethod,

                amount:
                    totalAmount,

                sessionId,

                orderId:
                    order._id
            });

        console.log(
            "PAYMENT DATA = ",
            paymentData
        );

    } catch (gatewayError) {

        console.error(
            "Gateway Error:",
            gatewayError
        );

        paymentSession.status =
            "FAILED";

        await paymentSession.save();

        order.paymentStatus =
            "FAILED";

        await order.save();

        return res.status(500).json({

            success: false,

            message:
                "Failed to create payment session"
        });
    }

    // ==========================
    // SAVE GATEWAY DATA
    // ==========================

    if (
        paymentData?.gatewayOrderId
    ) {

        paymentSession.gatewayOrderId =
            paymentData.gatewayOrderId;

        paymentSession.status =
            "PENDING";

        await paymentSession.save();
    }

    // ==========================
    // RESPONSE
    // ==========================

    const responseData = {
        test: "HELLO_BRO",
        success: true,

        orderId: order._id,

        paymentSessionId: paymentSession.sessionId,

        paymentMethod,

        paymentData,

        merchantUpiId: process.env.UPI_ID,

        razorpayKey: process.env.RAZORPAY_KEY_ID
    };

    console.log(
        "FINAL RESPONSE =",
        JSON.stringify(responseData, null, 2)
    );

    console.log(
        "SESSION CREATED:",
        sessionId
    );

    console.log(
        "PAYMENT METHOD:",
        paymentMethod
    );

    console.log(
        "PAYMENT DATA:",
        paymentData
    );

    console.log(
        JSON.stringify(
            {
                success: true,
                orderId: order._id,
                paymentSessionId: paymentSession.sessionId,
                paymentMethod,
                paymentData,
                merchantUpiId: process.env.UPI_ID,
                razorpayKey: process.env.RAZORPAY_KEY_ID
            },
            null,
            2
        )
    );

    return res.status(201).json(responseData);

} catch (error) {

    console.error(
        "CREATE PAYMENT SESSION ERROR:",
        error
    );

    return res.status(500).json({

        success: false,

        message:
            "Failed to create payment session"
    });
}

};

// ======================================================
// GET PAYMENT STATUS
// ======================================================

export const getPaymentStatus =
async (req, res) => {
try {

    const { sessionId } =
        req.params;

    let session =
        await PaymentSession.findOne({

            sessionId

        }).select(
            "status orderId amount paymentMethod expiresAt"
        );

    if (!session) {

        return res.status(404).json({

            success: false,

            message:
                "Payment session not found"
        });
    }

    // ==========================
    // EXPIRE SESSION
    // ==========================

    if (

        (
            session.status === "CREATED" ||

            session.status === "PENDING"
        ) &&

        session.expiresAt &&

        session.expiresAt < new Date()
    ) {

        session.status =
            "EXPIRED";

        await session.save();

        await Order.findByIdAndUpdate(

            session.orderId,

            {
                paymentStatus:
                    "FAILED"
            }
        );

        session =
            await PaymentSession.findById(
                session._id
            );
    }

    return res.json({

        success: true,

        status:
            session.status,

        orderId:
            session.orderId,

        amount:
            session.amount,

        paymentMethod:
            session.paymentMethod
    });

} catch (error) {

    console.error(error);

    return res.status(500).json({

        success: false,

        message:
            "Failed to fetch payment status"
    });
}
};
