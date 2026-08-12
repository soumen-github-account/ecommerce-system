import mongoose from "mongoose";

const SubCategoryLevel2Schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    image: {
      type: String,
      required: true,
    },

    subCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubCategory",
      required: true
    },
  },
  {
    timestamps: true,
  },
);

export const SubCategory2 = mongoose.model("SubCategoryLevel2", SubCategoryLevel2Schema);
