
import mongoose from "mongoose";

/**
 * Variant Attribute
 * Example:
 * Color
 * Size
 * RAM
 * Storage
 */

const VariantAttributeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    label: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: [
        "text",
        "number",
        "select",
        "boolean",
      ],
      default: "text",
    },

    required: {
      type: Boolean,
      default: false,
    },

    searchable: {
      type: Boolean,
      default: true,
    },

    filterable: {
      type: Boolean,
      default: true,
    },

    options: [
      {
        type: String,
      },
    ],

    sortOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    _id: false,
  }
);

/**
 * Specification Field
 */

const SpecificationFieldSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      trim: true,
    },

    label: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: [
        "text",
        "number",
        "boolean",
      ],
      default: "text",
    },

    required: {
      type: Boolean,
      default: false,
    },

    sortOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    _id: false,
  }
);

/**
 * Specification Group
 */

const SpecificationGroupSchema = new mongoose.Schema(
  {
    group: {
      type: String,
      required: true,
      trim: true,
    },

    sortOrder: {
      type: Number,
      default: 0,
    },

    fields: [SpecificationFieldSchema],
  },
  {
    _id: false,
  }
);

/**
 * Main Schema
 */

const CategoryAttributeSchema = new mongoose.Schema(
  {
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      unique: true,
      index: true,
    },

    subCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubCategory",
      default: null,
    },

    subCategoryLevel2: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubCategoryLevel2",
      default: null,
    },

    variantAttributes: [VariantAttributeSchema],

    specificationGroups: [SpecificationGroupSchema],
  },
  {
    timestamps: true,
  }
);

CategoryAttributeSchema.index({
  category: 1,
});

export const CategoryAttribute = mongoose.model(
  "CategoryAttribute",
  CategoryAttributeSchema
);
