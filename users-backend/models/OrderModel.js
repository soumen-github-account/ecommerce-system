// import mongoose from "mongoose";

// const orderSchema = new mongoose.Schema(
//     {
//         userId: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: "User",
//             required: true
//         },

//         items: [
//             {
//                 productId: {
//                     type: mongoose.Schema.Types.ObjectId,
//                     ref: "Product"
//                 },

//                 quantity: Number,

//                 price: Number,

//                 variantId: String
//             }
//         ],

//         addressId: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: "Address"
//         },

//         totalAmount: {
//             type: Number,
//             required: true
//         },

//         paymentMethod: {
//             type: String,
//             enum: ["UPI", "CARD", "COD"]
//         },

//         paymentStatus: {
//             type: String,
//             enum: [
//                 "PENDING",
//                 "SUCCESS",
//                 "FAILED"
//             ],
//             default: "PENDING"
//         },

//         orderStatus: {
//             type: String,
//             enum: [
//                 "INITIATED",
//                 "CONFIRMED",
//                 "SHIPPED",
//                 "DELIVERED",
//                 "CANCELLED"
//             ],
//             default: "INITIATED"
//         },

//         paymentSessionId: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: "PaymentSession"
//         }
//     },
//     {
//         timestamps: true
//     }
// );

// export const Order = mongoose.model(
//     "Order",
//     orderSchema
// );


// const OrderSchema = new mongoose.Schema({
//     orderNumber: {
//         type: String,
//         unique: true,
//         index: true
//     },

//     user: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "User",
//         required: true
//     },

//     items: [
//         {
//             product: {
//                 type: mongoose.Schema.Types.ObjectId,
//                 ref: "Product"
//             },

//             variant: {
//                 type: mongoose.Schema.Types.ObjectId,
//                 ref: "ProductVariant"
//             },

//             sku: String,

//             quantity: Number,

//             mrp: Number,

//             sellingPrice: Number,

//             totalPrice: Number,

//             productSnapshot: {
//                 name: String,

//                 image: String,

//                 attributes: {
//                     color: String,
//                     size: String
//                 }
//             },

//             itemStatus: {
//                 type: String,
//                 enum: [
//                     "PLACED",
//                     "CONFIRMED",
//                     "PACKED",
//                     "SHIPPED",
//                     "DELIVERED",
//                     "CANCELLED",
//                     "RETURNED"
//                 ],
//                 default: "PLACED"
//             }
//         }
//     ],

//     shippingAddress: {

//         fullName: String,

//         phone: String,

//         addressLine1: String,

//         addressLine2: String,

//         city: String,

//         state: String,

//         pincode: String,

//         country: String
//     },

//     pricing: {

//         subtotal: Number,

//         discount: Number,

//         shippingCharge: Number,

//         tax: Number,

//         totalAmount: Number
//     },

//     payment: {

//         method: String,

//         status: {
//             type: String,
//             enum: [
//                 "PENDING",
//                 "SUCCESS",
//                 "FAILED",
//                 "REFUNDED",
//                 "PARTIAL_REFUND"
//             ]
//         },

//         transactionId: String,

//         paymentProvider: String
//     },

//     status: {
//         type: String,
//         enum: [
//             "PLACED",
//             "CONFIRMED",
//             "PACKED",
//             "SHIPPED",
//             "DELIVERED",
//             "CANCELLED"
//         ],
//         default: "PLACED"
//     }
// }, {timestamps: true})

import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seller",
      required: true,
      index: true
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    variant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductVariant",
      required: true,
    },

    sku: {
      type: String,
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    pricing: {
      mrp: Number,
      sellingPrice: Number,
      costPrice: Number,
      tax: Number,
      discount: Number,
      total: Number,
    },

    snapshot: {
      title: String,
      variantName: String,
      image: String,

      attributes: [
        {
          name: String,
          value: String,
        },
      ],
    },

    status: {
      type: String,
      enum: [
        "PLACED",
        "CONFIRMED",
        "PACKED",
        "SHIPPED",
        "OUT_FOR_DELIVERY",
        "DELIVERED",
        "CANCELLED",
        "RETURN_REQUESTED",
        "RETURNED",
      ],
      default: "PLACED",
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
      index: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seller",
    },

    items: [orderItemSchema],

    shippingAddress: {
      fullName: String,
      phone: String,
      addressLine1: String,
      addressLine2: String,
      landmark: String,
      city: String,
      state: String,
      country: String,
      pincode: String,
    },

    pricing: {
      subtotal: Number,
      discount: Number,
      shippingCharge: Number,
      tax: Number,
      totalAmount: Number,
    },

    payment: {
      method: {
        type: String,
        enum: ["COD", "UPI", "CARD", "NET_BANKING", "WALLET"],
      },

      status: {
        type: String,
        enum: [
          "PENDING",
          "SUCCESS",
          "FAILED",
          "REFUNDED",
          "PARTIAL_REFUND",
        ],
        default: "PENDING",
      },

      transactionId: String,

      paymentProvider: String,
    },

    status: {
      type: String,
      enum: [
        "PLACED",
        "CONFIRMED",
        "PACKED",
        "SHIPPED",
        "OUT_FOR_DELIVERY",
        "DELIVERED",
        "CANCELLED",
      ],
      default: "PLACED",
    },
  },
  {
    timestamps: true,
  }
);

export const Order = mongoose.model("Order", orderSchema);