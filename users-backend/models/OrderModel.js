import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        items: [
            {
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product"
                },

                quantity: Number,

                price: Number,

                variantId: String
            }
        ],

        addressId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Address"
        },

        totalAmount: {
            type: Number,
            required: true
        },

        paymentMethod: {
            type: String,
            enum: ["UPI", "CARD", "COD"]
        },

        paymentStatus: {
            type: String,
            enum: [
                "PENDING",
                "SUCCESS",
                "FAILED"
            ],
            default: "PENDING"
        },

        orderStatus: {
            type: String,
            enum: [
                "INITIATED",
                "CONFIRMED",
                "SHIPPED",
                "DELIVERED",
                "CANCELLED"
            ],
            default: "INITIATED"
        },

        paymentSessionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "PaymentSession"
        }
    },
    {
        timestamps: true
    }
);

export const Order = mongoose.model(
    "Order",
    orderSchema
);


const OrderSchema = new mongoose.Schema({
    orderNumber: {
        type: String,
        unique: true,
        index: true
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    items: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product"
            },

            variant: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "ProductVariant"
            },

            sku: String,

            quantity: Number,

            mrp: Number,

            sellingPrice: Number,

            totalPrice: Number,

            productSnapshot: {
                name: String,

                image: String,

                attributes: {
                    color: String,
                    size: String
                }
            },

            itemStatus: {
                type: String,
                enum: [
                    "PLACED",
                    "CONFIRMED",
                    "PACKED",
                    "SHIPPED",
                    "DELIVERED",
                    "CANCELLED",
                    "RETURNED"
                ],
                default: "PLACED"
            }
        }
    ],

    shippingAddress: {

        fullName: String,

        phone: String,

        addressLine1: String,

        addressLine2: String,

        city: String,

        state: String,

        pincode: String,

        country: String
    },

    pricing: {

        subtotal: Number,

        discount: Number,

        shippingCharge: Number,

        tax: Number,

        totalAmount: Number
    },

    payment: {

        method: String,

        status: {
            type: String,
            enum: [
                "PENDING",
                "SUCCESS",
                "FAILED",
                "REFUNDED",
                "PARTIAL_REFUND"
            ]
        },

        transactionId: String,

        paymentProvider: String
    },

    status: {
        type: String,
        enum: [
            "PLACED",
            "CONFIRMED",
            "PACKED",
            "SHIPPED",
            "DELIVERED",
            "CANCELLED"
        ],
        default: "PLACED"
    }
}, {timestamps: true})

