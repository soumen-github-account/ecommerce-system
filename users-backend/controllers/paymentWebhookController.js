
import crypto from "crypto";

import { Order } from "../models/OrderModel.js";
import { Cart } from "../models/CartModel.js";
import { Product } from "../models/ProductModel.js";
import { PaymentSession } from "../models/PaymentSession.js";

export const razorpayWebhook = async (req, res) => {
try {
console.log("Webhook Hit");

const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

const receivedSignature = req.headers["x-razorpay-signature"];

const expectedSignature =
  crypto
    .createHmac(
      "sha256",
      webhookSecret
    )
    .update(req.body)
    .digest("hex");

if (
  expectedSignature !==
  receivedSignature
) {

  console.log(
    "Invalid Signature"
  );

  return res.status(400).json({
    success: false,
    message: "Invalid signature"
  });
}

const payload =
  JSON.parse(
    req.body.toString()
  );

const event =
  payload.event;

console.log(
  "WEBHOOK EVENT:",
  event
);

// ==================================
// PAYMENT CAPTURED
// ==================================

if (
  event === "payment.captured"
) {

  const payment =
    payload.payload.payment
      .entity;

  const gatewayOrderId =
    payment.order_id;

  const gatewayPaymentId =
    payment.id;

  // ==================================
  // IDEMPOTENT UPDATE
  // ==================================

  const paymentSession =
    await PaymentSession.findOneAndUpdate(

      {
        gatewayOrderId,

        status: {
          $ne: "SUCCESS"
        }
      },

      {
        $set: {

          status: "SUCCESS",

          gatewayPaymentId,

          paidAt:
            new Date()
        }
      },

      {
        new: true
      }
    );

  // already processed
  if (!paymentSession) {

    return res.status(200).json({

      success: true,

      message:
        "Already processed"
    });
  }

  const order =
    await Order.findById(
      paymentSession.orderId
    );

  if (order) {

    order.paymentStatus =
      "SUCCESS";

    order.orderStatus =
      "CONFIRMED";

    await order.save();

    // =====================
    // STOCK REDUCE
    // =====================

    for (
      const item of order.items
    ) {

      const updatedProduct =
        await Product.findOneAndUpdate(

          {
            _id:
              item.productId,

            stock: {
              $gte:
                item.quantity
            }
          },

          {
            $inc: {
              stock:
                -item.quantity
            }
          },

          {
            new: true
          }
        );

      if (
        !updatedProduct
      ) {

        console.error(
          "Stock deduction failed for product:",
          item.productId
        );
      }
    }

    // =====================
    // CLEAR CART
    // =====================

    await Cart.deleteMany({

      user:
        order.userId
    });
  }
}

// ==================================
// PAYMENT FAILED
// ==================================

if (
  event === "payment.failed"
) {

  const payment =
    payload.payload.payment
      .entity;

  const gatewayOrderId =
    payment.order_id;

  await PaymentSession.findOneAndUpdate(

    {
      gatewayOrderId,

      status: {
        $nin: [
          "SUCCESS",
          "FAILED"
        ]
      }
    },

    {
      status:
        "FAILED",

      failureReason:
        payment.error_description
    }
  );

  await Order.updateOne(

    {
      paymentSessionId:
        (
          await PaymentSession.findOne({
            gatewayOrderId
          })
        )?._id
    },

    {
      paymentStatus:
        "FAILED"
    }
  );
}

return res.status(200).json({
  success: true
});

} catch (error) {

console.error(
  "WEBHOOK ERROR:",
  error
);

return res.status(500).json({
  success: false
});

}
};
