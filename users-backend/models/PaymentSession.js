// import mongoose from "mongoose";

// const paymentSessionSchema = new mongoose.Schema({

//     sessionId: {
//         type: String,
//         required: true,
//         unique: true,
//         index: true
//     },

//     userId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "User",
//         required: true,
//         index: true
//     },

//     orderId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Order",
//         required: true,
//         index: true
//     },

//     amount: {
//         type: Number,
//         required: true
//     },

//     currency: {
//         type: String,
//         default: "INR"
//     },

//     paymentMethod: {
//         type: String,
//         enum: [
//             "UPI",
//             "CARD",
//             "COD"
//         ],
//         required: true
//     },

//     provider: {
//         type: String,
//         default: "RAZORPAY"
//     },

//     status: {
//         type: String,
//         enum: [
//             "CREATED",
//             "PENDING",
//             "SUCCESS",
//             "FAILED",
//             "EXPIRED"
//         ],
//         default: "CREATED",
//         index: true
//     },

//     upiAppPackage: {
//         type: String,
//         default: null
//     },

//     gatewayOrderId: {
//         type: String,
//         default: null,
//         index: true
//     },

//     gatewayPaymentId: {
//         type: String,
//         default: null
//     },

//     gatewaySignature: {
//         type: String,
//         default: null
//     },

//     paidAt: {
//         type: Date,
//         default: null
//     },

//     failureReason: {
//         type: String,
//         default: null
//     },

//     expiresAt: {
//         type: Date,
//         default: () => new Date(
//             Date.now() + 15 * 60 * 1000
//         )
//     }

// }, {
//     timestamps: true
// });

// paymentSessionSchema.index({
//     sessionId: 1
// });

// paymentSessionSchema.index({
//     gatewayOrderId: 1
// });

// export const PaymentSession = mongoose.model(
//     "PaymentSession",
//     paymentSessionSchema
// );


import mongoose from "mongoose";

const paymentSessionSchema = new mongoose.Schema({

    sessionId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },

    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        required: true,
        index: true
    },

    amount: {
        type: Number,
        required: true
    },

    currency: {
        type: String,
        default: "INR"
    },

    paymentMethod: {
        type: String,
        enum: [
            "UPI",
            "CARD",
            "NETBANKING",
            "WALLET",
            "EMI",
            "COD"
        ],
        required: true
    },

    provider: {
        type: String,
        default: "RAZORPAY"
    },

    status: {
        type: String,
        enum: [
            "CREATED",
            "PENDING",
            "AUTHORIZED",
            "SUCCESS",
            "FAILED",
            "REFUNDED",
            "PARTIALLY_REFUNDED",
            "EXPIRED"
        ],
        default: "CREATED",
        index: true
    },

    attemptNumber:{
        type:Number,
        default:1
    },

    retryCount:{
        type:Number,
        default:0
    },

    upiAppPackage: {
        type: String,
        default: null
    },

    //----------------------------------
    // Gateway IDs
    //----------------------------------

    gatewayOrderId: {
        type: String,
        default: null,
        index: true
    },

    gatewayPaymentId: {
        type: String,
        default: null,
        index: true
    },

    gatewayRefundId: {
        type: String,
        default: null
    },

    gatewaySignature: {
        type: String,
        default: null
    },

    //----------------------------------
    // Payment Timing
    //----------------------------------

    paidAt: {
        type: Date,
        default: null
    },

    refundedAt: {
        type: Date,
        default: null
    },

    expiresAt: {
        type: Date,
        default: () =>
            new Date(Date.now() + 15 * 60 * 1000)
    },

    //----------------------------------
    // Failure
    //----------------------------------

    failureReason: {
        type: String,
        default: null
    },

    //----------------------------------
    // Complete Gateway Response
    //----------------------------------

    gatewayResponse: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    }

}, {
    timestamps: true
});

paymentSessionSchema.index({
    sessionId: 1
});

paymentSessionSchema.index({
    gatewayOrderId: 1
});

paymentSessionSchema.index({
    gatewayPaymentId: 1
});

export const PaymentSession = mongoose.model(
    "PaymentSession",
    paymentSessionSchema
);