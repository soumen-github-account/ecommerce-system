import mongoose from "mongoose";

const refundSchema = new mongoose.Schema(
  {
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PaymentTransaction",
      required: true,
    },

    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },

    refundId: String,

    amount: Number,

    reason: String,

    status: {
      type: String,
      enum: ["PENDING", "PROCESSED", "FAILED"],
      default: "PENDING",
    },

    gatewayResponse: Object,
  },
  {
    timestamps: true,
  },
);

export const RefundTransaction = mongoose.model(
  "RefundTransaction",
  refundSchema,
);
