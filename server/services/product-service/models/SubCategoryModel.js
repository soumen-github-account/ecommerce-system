import mongoose from "mongoose";

const SubCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    // image: {
    //   type: String,
    //   required: true,
    // },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    level2Categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubCategoryLevel2",
      },
    ],
  },
  {
    timestamps: true,
  },
);

export const SubCategory = mongoose.model("SubCategory", SubCategorySchema);
