import mongoose from "mongoose";

// const CartSchema = new mongoose.Schema(
//   {
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },

//     product: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Product",
//       required: true,
//     },

//     quantity: {
//       type: Number,
//       default: 1,
//     },

//     varient: {
//       type: String
//     }
//   },
//   {
//     timestamps: true,
//   },
// );


const CartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },

  variant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ProductVariant",
  },

  quantity: Number,
});

export const Cart = mongoose.model("Cart", CartSchema);
