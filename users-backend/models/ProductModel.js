import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    images: [
      {
        type: String,
      },
    ],

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    subCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubCategory",
      required: true,
    },

    subCategoryLevel2: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubCategoryLevel2",
      required: true,
    },

    unit: {
      type: String,
      required: true,
    },

    type: [
      {
        type: String,
      },
    ],

    stock: {
      type: Number,
      default: 0,
    },

    price: [
      {
        type: Number,
      },
    ],

    discount: {
      type: Number,
      default: 0,
    },

    description: {
      type: String,
      required: true,
    },

    details: [
      {
        type: String,
      },
    ],

    detailsType: [
      {
        type: String,
      },
    ],

    publish: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Product = mongoose.model("Product", ProductSchema);
