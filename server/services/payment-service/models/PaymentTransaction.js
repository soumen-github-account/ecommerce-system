import mongoose from "mongoose";

const paymentTransactionSchema = new mongoose.Schema(
{
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

    paymentSession: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PaymentSession",
        required: true,
        index: true
    },

    gateway: {
        type: String,
        default: "RAZORPAY"
    },

    gatewayOrderId: {
        type: String,
        index: true
    },

    gatewayPaymentId: {
        type: String,
        default: null,
        index: true
    },

    gatewaySignature: {
        type: String,
        default: null
    },

    amount: Number,

    currency: {
        type: String,
        default: "INR"
    },

    paymentMethod: String,

    upiApp: String,

    status: {
        type: String,
        enum: [
            "CREATED",
            "PENDING",
            "AUTHORIZED",
            "SUCCESS",
            "FAILED",
            "CANCELLED",
            "REFUNDED",
            "PARTIALLY_REFUNDED"
        ],
        default: "CREATED",
        index: true
    },

    //--------------------------------
    // Payment Timing
    //--------------------------------

    paidAt: {
        type: Date,
        default: null
    },

    failedAt: {
        type: Date,
        default: null
    },

    //--------------------------------
    // Failure
    //--------------------------------

    failureReason: {
        type: String,
        default: null
    },

    bankReference: {
        type: String,
        default: null
    },

    //--------------------------------
    // Complete Gateway Response
    //--------------------------------

    gatewayResponse: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },

    //--------------------------------
    // Timeline
    //--------------------------------

    timeline: [
        {
            status: String,
            message: String,
            createdAt: {
                type: Date,
                default: Date.now
            }
        }
    ],

    //--------------------------------
    // Refund
    //--------------------------------

    refund: {

        status: {
            type: String,
            enum: [
                "NONE",
                "PENDING",
                "PROCESSED",
                "FAILED"
            ],
            default: "NONE"
        },

        refundId: {
            type: String,
            default: null
        },

        amount: {
            type: Number,
            default: 0
        },

        processedAt: {
            type: Date,
            default: null
        },

        failureReason: {
            type: String,
            default: null
        }

    },

    //--------------------------------

    notes: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    }

},
{
    timestamps: true
}
);

export const PaymentTransaction = mongoose.model(
    "PaymentTransaction",
    paymentTransactionSchema
);