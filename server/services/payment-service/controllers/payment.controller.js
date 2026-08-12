import mongoose from "mongoose";
import axios from "axios";
import { PaymentSession } from "../models/PaymentSession.js";
import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";
import { razorpay } from "../config/razorpay.js";
import { PaymentTransaction } from "../models/PaymentTransaction.js";

export const getRazorpayConfig = async (req, res) => {
  try {
    res.json({
      success: true,
      razorpayKey: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const createOrder = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      addressId,
      paymentMethod,
    } = req.body;

    // ==========================================
    // Validate
    // ==========================================

    if (!addressId) {
      return res.status(400).json({
        success: false,
        message: "Address is required",
      });
    }

    if (!paymentMethod) {
      return res.status(400).json({
        success: false,
        message: "Payment method is required",
      });
    }

    // ==========================================
    // 1. Get Address from User Service
    // ==========================================

    const addressResponse = await axios.get(
      `${process.env.USER_SERVICE_URL}/users/get-address/${addressId}`,
      {
        headers: {
          Authorization: req.headers.authorization,
        },
      }
    );

    if (!addressResponse.data.success) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    const address = addressResponse.data.address;

    // ==========================================
    // 2. Get Cart from User Service
    // ==========================================

    const cartResponse = await axios.get(
      `${process.env.USER_SERVICE_URL}/users/get-cart`,
      {
        headers: {
          Authorization: req.headers.authorization,
        },
      }
    );

    if (!cartResponse.data.success) {
      return res.status(400).json({
        success: false,
        message: "Unable to fetch cart",
      });
    }

    const cartItems = cartResponse.data.cart || [];

    if (cartItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    // ==========================================
    // 3. Get Product Details
    // ==========================================

    const productResponse = await axios.post(
      `${process.env.PRODUCT_SERVICE_URL}/products/internal/cart-products`,
      {
        items: cartItems.map((item) => ({
          cartId: item._id,
          productId: item.product,
          variantId: item.variant,
          quantity: item.quantity,
        })),
      }
    );

    if (!productResponse.data.success) {
      return res.status(400).json({
        success: false,
        message: "Unable to fetch product details",
      });
    }

    const cartProducts =
      productResponse.data.cartItems || [];

    if (cartProducts.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid products found",
      });
    }

    // ==========================================
    // 4. Prepare Order Data
    // ==========================================

    let subtotal = 0;

    const orderItems = [];

    for (const item of cartProducts) {

      const stock =
        item.inventory?.stock || 0;

      if (stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `${item.title} is out of stock`,
        });
      }

      const sellingPrice =
        item.pricing?.sellingPrice || 0;

      const total =
        sellingPrice * item.quantity;

      subtotal += total;

      orderItems.push({
        seller: item.sellerId,

        product: item.productId,

        variant: item.variantId,

        sku: item.sku,

        quantity: item.quantity,

        pricing: {
          mrp: item.pricing?.mrp || 0,

          sellingPrice,

          costPrice:
            item.pricing?.costPrice || 0,

          discount:
            item.pricing?.discount || 0,

          tax:
            item.pricing?.tax || 0,

          total,
        },

        snapshot: {
          title: item.title,

          variantName:
            item.variantName,

          image:
            item.image || "",

          attributes:
            item.attributes || [],
        },
      });
    }

    // ==========================================
    // 5. Pricing
    // ==========================================

    const shippingCharge = 0;
    const discount = 0;
    const tax = 0;

    const totalAmount =
      subtotal +
      shippingCharge +
      tax -
      discount;

    // ==========================================
    // 6. Send Order Data to Order Service
    // ==========================================

    const orderResponse = await axios.post(
      `${process.env.ORDER_SERVICE_URL}/orders/internal/create-order`,
      {
        userId,

        orderItems,

        shippingAddress: {
          fullName: address.fullName,

          phone: address.phone,

          addressLine1:
            address.addressLine1,

          addressLine2:
            address.addressLine2,

          landmark:
            address.landmark,

          city:
            address.city,

          state:
            address.state,

          country:
            address.country,

          pincode:
            address.pincode,
        },

        pricing: {
          subtotal,

          discount,

          shippingCharge,

          tax,

          totalAmount,
        },

        payment: {
          method: paymentMethod,
          status: "PENDING",
        },

        status: "PLACED",
      }
    );

    // ==========================================
    // 7. Order Service Failed
    // ==========================================

    if (!orderResponse.data.success) {
      return res.status(400).json({
        success: false,
        message:
          orderResponse.data.message ||
          "Order creation failed",
      });
    }

    // ==========================================
    // 8. Response
    // ==========================================

    return res.status(201).json({
      success: true,

      orderId:
        orderResponse.data.orderId,

      orderNumber:
        orderResponse.data.orderNumber,

      totalAmount:
        orderResponse.data.totalAmount,
    });

  } catch (error) {

    console.error(
      "PAYMENT SERVICE CREATE ORDER ERROR:"
    );

    console.error(
      error.response?.data ||
      error.message
    );

    return res.status(
      error.response?.status || 500
    ).json({
      success: false,

      message:
        error.response?.data?.message ||
        error.message,
    });
  }
};

export const createPaymentSession = async (req, res) => {

    const mongoSession = await mongoose.startSession();

    try {

        const userId = req.user.id;

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

            await mongoSession.abortTransaction();

            return res.status(400).json({
                success: false,
                message: "Order Id is required"
            });

        }

        if (!paymentMethod) {

            await mongoSession.abortTransaction();

            return res.status(400).json({
                success: false,
                message: "Payment Method is required"
            });

        }

        //------------------------------------
        // Get Order From ORDER SERVICE
        //------------------------------------

        const orderResponse = await axios.get(
            `${process.env.ORDER_SERVICE_URL}/orders/internal/${orderId}`,
            {
                headers: {
                    Authorization: req.headers.authorization
                }
            }
        );

        if (!orderResponse.data.success) {

            await mongoSession.abortTransaction();

            return res.status(404).json({
                success: false,
                message: "Order not found"
            });

        }

        const order = orderResponse.data.order;

        //------------------------------------
        // Ownership
        //------------------------------------

        if (
            order.user.toString() !==
            userId.toString()
        ) {

            await mongoSession.abortTransaction();

            return res.status(403).json({
                success: false,
                message: "Unauthorized order"
            });

        }

        //------------------------------------
        // Already Paid
        //------------------------------------

        if (
            order.payment?.status === "SUCCESS"
        ) {

            await mongoSession.abortTransaction();

            return res.status(400).json({
                success: false,
                message: "Order already paid"
            });

        }

        //------------------------------------
        // Amount
        //------------------------------------

        const amount =
            Number(order.pricing?.totalAmount || 0);

        if (!amount || amount <= 0) {

            await mongoSession.abortTransaction();

            return res.status(400).json({
                success: false,
                message: "Invalid order amount"
            });

        }

        //------------------------------------
        // Update Payment Method
        // Through ORDER SERVICE
        //------------------------------------

        await axios.patch(
            `${process.env.ORDER_SERVICE_URL}/orders/internal/${orderId}/payment`,
            {
                paymentMethod:
                    paymentMethod.toUpperCase()
            },
            {
                headers: {
                    Authorization:
                        req.headers.authorization
                }
            }
        );

        //------------------------------------
        // COD
        //------------------------------------

        if (
            paymentMethod.toUpperCase() === "COD"
        ) {

            const [paymentSession] =
                await PaymentSession.create(
                    [
                        {
                            sessionId: uuidv4(),

                            userId,

                            orderId,

                            amount,

                            currency: "INR",

                            paymentMethod: "COD",

                            provider: "COD",

                            status: "CREATED"
                        }
                    ],
                    {
                        session: mongoSession
                    }
                );

            await PaymentTransaction.create(
                [
                    {
                        user: userId,

                        order: orderId,

                        paymentSession:
                            paymentSession._id,

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
                    }
                ],
                {
                    session: mongoSession
                }
            );

            await mongoSession.commitTransaction();

            return res.status(200).json({

                success: true,

                paymentSessionId:
                    paymentSession.sessionId,

                orderId,

                paymentData: null,

                merchantUpiId: null

            });

        }

        //------------------------------------
        // ONLINE PAYMENT
        //------------------------------------

        const lastSession =
            await PaymentSession.findOne({
                orderId
            })
            .sort({
                createdAt: -1
            })
            .session(mongoSession);

        let retryCount = 0;

        if (lastSession) {

            retryCount =
                (lastSession.retryCount || 0) + 1;

        }

        //------------------------------------
        // Razorpay Order
        //------------------------------------

        const razorpayOrder =
            await razorpay.orders.create({

                amount:
                    Math.round(amount * 100),

                currency: "INR",

                receipt:
                    order.orderNumber,

                notes: {

                    orderId:
                        orderId.toString(),

                    orderNumber:
                        order.orderNumber,

                    userId:
                        userId.toString()

                }

            });

        //------------------------------------
        // Payment Session
        //------------------------------------

        const [paymentSession] =
            await PaymentSession.create(
                [
                    {
                        sessionId: uuidv4(),

                        userId,

                        orderId,

                        amount,

                        currency: "INR",

                        paymentMethod:
                            paymentMethod.toUpperCase(),

                        provider: "RAZORPAY",

                        upiAppPackage,

                        gatewayOrderId:
                            razorpayOrder.id,

                        status: "CREATED",

                        retryCount,

                        expiresAt:
                            new Date(
                                Date.now() +
                                15 * 60 * 1000
                            )
                    }
                ],
                {
                    session: mongoSession
                }
            );

        //------------------------------------
        // Payment Transaction
        //------------------------------------

        await PaymentTransaction.create(
            [
                {
                    user: userId,

                    order: orderId,

                    paymentSession:
                        paymentSession._id,

                    gateway: "RAZORPAY",

                    gatewayOrderId:
                        razorpayOrder.id,

                    gatewayPaymentId: null,

                    amount,

                    currency: "INR",

                    paymentMethod:
                        paymentMethod.toUpperCase(),

                    status: "CREATED",

                    timeline: [
                        {
                            status: "CREATED",

                            message:
                                "Payment session created"
                        }
                    ]
                }
            ],
            {
                session: mongoSession
            }
        );

        //------------------------------------
        // Commit
        //------------------------------------

        await mongoSession.commitTransaction();

        //------------------------------------
        // Response
        //------------------------------------

        return res.status(201).json({

            success: true,

            paymentSessionId:
                paymentSession.sessionId,

            orderId,

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
                error.response?.data?.message ||
                error.message

        });

    }

    finally {

        await mongoSession.endSession();

    }

};

export const getPaymentStatus = async (req, res) => {
    try {

        const { sessionId } = req.params;

        const userId = req.user.id;

        //------------------------------------
        // Payment Session
        //------------------------------------

        const paymentSession =
            await PaymentSession.findOne({
                sessionId
            });

        if (!paymentSession) {

            return res.status(404).json({

                success: false,

                message:
                    "Payment session not found"

            });

        }

        //------------------------------------
        // Ownership Check
        //------------------------------------

        if (
            paymentSession.userId.toString() !==
            userId.toString()
        ) {

            return res.status(403).json({

                success: false,

                message:
                    "Unauthorized payment session"

            });

        }

        //------------------------------------
        // Get Order From ORDER SERVICE
        //------------------------------------

        const orderResponse = await axios.get(

            `${process.env.ORDER_SERVICE_URL}/orders/internal/${paymentSession.orderId}`,

            {
                headers: {
                    Authorization:
                        req.headers.authorization
                }
            }

        );

        if (
            !orderResponse.data ||
            !orderResponse.data.success
        ) {

            return res.status(404).json({

                success: false,

                message:
                    "Order not found"

            });

        }

        let order =
            orderResponse.data.order;

        //------------------------------------
        // Razorpay Verification
        //------------------------------------

        if (
            paymentSession.gatewayOrderId &&
            paymentSession.status !== "SUCCESS"
        ) {

            try {

                //------------------------------------
                // Fetch Razorpay Order
                //------------------------------------

                const razorpayOrder =
                    await razorpay.orders.fetch(
                        paymentSession.gatewayOrderId
                    );

                //------------------------------------
                // Payment Completed
                //------------------------------------

                if (
                    razorpayOrder.status === "paid"
                ) {

                    //------------------------------------
                    // Get Razorpay Payments
                    //------------------------------------

                    const payments =
                        await razorpay.orders.fetchPayments(
                            paymentSession.gatewayOrderId
                        );

                    let gatewayPaymentId = null;

                    if (
                        payments.items &&
                        payments.items.length > 0
                    ) {

                        gatewayPaymentId =
                            payments.items[0].id;

                    }

                    //------------------------------------
                    // Update Payment Session
                    //------------------------------------

                    paymentSession.status =
                        "SUCCESS";

                    paymentSession.paidAt =
                        new Date();

                    if (gatewayPaymentId) {

                        paymentSession.gatewayPaymentId =
                            gatewayPaymentId;

                    }

                    await paymentSession.save();

                    //------------------------------------
                    // Update Payment Transaction
                    //------------------------------------

                    const transaction =
                        await PaymentTransaction.findOne({

                            paymentSession:
                                paymentSession._id

                        });

                    if (transaction) {

                        transaction.status =
                            "SUCCESS";

                        if (gatewayPaymentId) {

                            transaction.gatewayPaymentId =
                                gatewayPaymentId;

                        }

                        transaction.timeline.push({

                            status: "SUCCESS",

                            message:
                                "Payment successful",

                            createdAt:
                                new Date()

                        });

                        await transaction.save();

                    }

                    //------------------------------------
                    // Update ORDER SERVICE
                    //------------------------------------

                    const updateOrderResponse =
                        await axios.patch(

                            `${process.env.ORDER_SERVICE_URL}/orders/internal/${paymentSession.orderId}/payment-status`,

                            {
                                status: "SUCCESS",

                                transactionId:
                                    gatewayPaymentId,

                                paymentProvider:
                                    "RAZORPAY"
                            },

                            {
                                headers: {

                                    Authorization:
                                        req.headers.authorization

                                }
                            }

                        );

                    if (
                        updateOrderResponse.data &&
                        updateOrderResponse.data.success
                    ) {

                        //------------------------------------
                        // Refresh Order
                        //------------------------------------

                        const refreshedOrderResponse =
                            await axios.get(

                                `${process.env.ORDER_SERVICE_URL}/orders/internal/${paymentSession.orderId}`,

                                {
                                    headers: {

                                        Authorization:
                                            req.headers.authorization

                                    }
                                }

                            );

                        if (
                            refreshedOrderResponse.data &&
                            refreshedOrderResponse.data.success
                        ) {

                            order =
                                refreshedOrderResponse.data.order;

                        }

                    }

                }

            }
            catch (razorpayError) {

                console.log(
                    "Razorpay Verify Error:",
                    razorpayError.message
                );

            }

        }

        //------------------------------------
        // Response
        //------------------------------------

        return res.status(200).json({

            success: true,

            orderId:
                paymentSession.orderId,

            orderNumber:
                order.orderNumber,

            orderStatus:
                order.status,

            paymentStatus:
                order.payment?.status ||
                "PENDING",

            paymentMethod:
                order.payment?.method ||
                paymentSession.paymentMethod,

            paymentSessionStatus:
                paymentSession.status

        });

    }
    catch (error) {

        console.error(
            "GET PAYMENT STATUS ERROR:"
        );

        console.error(error);

        return res.status(500).json({

            success: false,

            message:
                error.response?.data?.message ||
                error.message

        });

    }
};
