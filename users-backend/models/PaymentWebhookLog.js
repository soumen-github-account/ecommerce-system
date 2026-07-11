import mongoose from "mongoose";

const webhookSchema = new mongoose.Schema(
  {
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PaymentTransaction",
    },

    event: String,

    payload: Object,

    signature: String,

    processed: {
      type: Boolean,
      default: false,
    },

    processedAt: Date,

    error: String,
  },
  {
    timestamps: true,
  },
);

export const PaymentWebhookLog = mongoose.model(
  "PaymentWebhookLog",
  webhookSchema,
);
