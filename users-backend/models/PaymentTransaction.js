import mongoose from "mongoose";

const paymentTransactionSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      index: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    paymentSession: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PaymentSession",
      required: true,
      index: true
    },

    gateway: {
      type: String,
      default: "RAZORPAY",
    },

    gatewayOrderId: String,

    gatewayPaymentId: String,

    gatewaySignature: String,

    amount: Number,

    currency: {
      type: String,
      default: "INR",
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
        "PARTIALLY_REFUNDED",
      ],
      default: "CREATED",
    },

    failureReason: String,

    bankReference: String,

    notes: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  },
);

export const PaymentTransaction = mongoose.model(
  "PaymentTransaction",
  paymentTransactionSchema,
);
