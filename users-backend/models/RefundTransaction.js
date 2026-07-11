// import mongoose from "mongoose";

// const refundSchema = new mongoose.Schema(
//   {
//     payment: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "PaymentTransaction",
//       required: true,
//     },

//     order: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Order",
//     },

//     refundId: String,

//     amount: Number,

//     reason: String,

//     status: {
//       type: String,
//       enum: ["PENDING", "PROCESSED", "FAILED"],
//       default: "PENDING",
//     },

//     gatewayResponse: Object,
//   },
//   {
//     timestamps: true,
//   },
// );

// export const RefundTransaction = mongoose.model(
//   "RefundTransaction",
//   refundSchema,
// );

import mongoose from "mongoose";

const refundSchema = new mongoose.Schema({

    paymentTransaction: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PaymentTransaction",
        required: true,
        index: true
    },

    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        required: true,
        index: true
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },

    gateway: {
        type: String,
        default: "RAZORPAY"
    },

    gatewayRefundId: {
        type: String,
        default: null,
        index: true
    },

    gatewayPaymentId: {
        type: String,
        default: null
    },

    amount: {
        type: Number,
        required: true
    },

    currency: {
        type: String,
        default: "INR"
    },

    reason: {
        type: String,
        default: null
    },

    status: {
        type: String,
        enum: [
            "PENDING",
            "PROCESSING",
            "SUCCESS",
            "FAILED"
        ],
        default: "PENDING",
        index: true
    },

    gatewayResponse: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },

    refundedAt: {
        type: Date,
        default: null
    },

    failedAt: {
        type: Date,
        default: null
    },

    failureReason: {
        type: String,
        default: null
    },

    timeline: [
        {
            status: String,
            message: String,
            createdAt: {
                type: Date,
                default: Date.now
            }
        }
    ]

}, {
    timestamps: true
});

export const Refund = mongoose.model(
    "Refund",
    refundSchema
);