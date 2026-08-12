
import mongoose from "mongoose";

const WishlistItemSchema = new mongoose.Schema(
  {
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

    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seller",
      required: true,
    },

    addedAt: {
      type: Date,
      default: Date.now,
    },

    notifyPriceDrop: {
      type: Boolean,
      default: true,
    },

    notifyBackInStock: {
      type: Boolean,
      default: true,
    },
  },
  {
    _id: false,
  }
);

const WishlistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    items: [WishlistItemSchema],
  },
  {
    timestamps: true,
  }
);

export const Wishlist = mongoose.model(
    "Wishlist",
    WishlistSchema
);

WishlistSchema.index({
    user: 1
});