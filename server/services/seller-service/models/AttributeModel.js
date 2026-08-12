
import mongoose from "mongoose";

const AttributeSchema = new mongoose.Schema(
  {
    /**
     * Internal Name
     * color
     * ram
     * storage
     * size
     */

    name: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    /**
     * Display Name
     */

    label: {
      type: String,
      required: true,
      trim: true,
    },

    /**
     * Variant Attribute
     * OR
     * Specification
     */

    attributeType: {
      type: String,
      enum: [
        "variant",
        "specification",
      ],
      required: true,
    },

    /**
     * Input Type
     */

    fieldType: {
      type: String,
      enum: [
        "text",
        "number",
        "boolean",
        "select",
        "multiselect",
        "color",
      ],
      default: "text",
    },

    /**
     * Units
     */

    unit: {
      type: String,
      default: "",
    },

    /**
     * Search Filter
     */

    searchable: {
      type: Boolean,
      default: true,
    },

    filterable: {
      type: Boolean,
      default: true,
    },

    comparable: {
      type: Boolean,
      default: true,
    },

    sortable: {
      type: Boolean,
      default: false,
    },

    /**
     * Required
     */

    required: {
      type: Boolean,
      default: false,
    },

    /**
     * Active
     */

    isActive: {
      type: Boolean,
      default: true,
    }
  },
  {
    timestamps: true,
  }
);

AttributeSchema.index({
  name: 1,
});

AttributeSchema.index({
  attributeType: 1,
});

export const Attribute = mongoose.model(
  "Attribute",
  AttributeSchema
);
