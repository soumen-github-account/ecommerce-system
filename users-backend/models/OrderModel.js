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