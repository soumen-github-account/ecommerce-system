import mongoose from "mongoose";

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
