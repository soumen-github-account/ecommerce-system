import mongoose from "mongoose";

// const WishlistSchema = new mongoose.Schema(
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
//   },
//   {
//     timestamps: true,
//   },
// );

const WishlistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // Selected Variant
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductVariant",
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Same variant ek user sirf ek hi baar wishlist me add kar sake
WishlistSchema.index(
  {
    user: 1,
    product: 1,
  },
  {
    unique: true,
  }
);

export const Wishlist = mongoose.model("Wishlist", WishlistSchema);
