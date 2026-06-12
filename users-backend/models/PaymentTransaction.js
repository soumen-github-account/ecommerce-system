import mongoose from "mongoose";

const paymentTransactionSchema =
    new mongoose.Schema(
        {
            paymentSessionId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "PaymentSession"
            },

            transactionId: String,

            amount: Number,

            status: {
                type: String,
                enum: [
                    "SUCCESS",
                    "FAILED"
                ]
            },

            providerResponse: Object
        },
        {
            timestamps: true
        }
    );

export const PaymentTransaction = mongoose.model(
    "PaymentTransaction",
    paymentTransactionSchema
);