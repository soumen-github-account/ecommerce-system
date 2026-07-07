
import mongoose from "mongoose";

const AttributeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    value: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false }
);

const SpecificationFieldSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      trim: true,
    },

    value: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false }
);

const SpecificationGroupSchema = new mongoose.Schema(
  {
    group: {
      type: String,
      required: true,
      trim: true,
    },

    fields: [SpecificationFieldSchema],
  },
  { _id: false }
);

const ImageSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
    },

    public_id: {
      type: String,
      default: "",
    },

    alt: {
      type: String,
      default: "",
    },

    isPrimary: {
      type: Boolean,
      default: false,
    },

    sortOrder: {
      type: Number,
      default: 0,
    },
  },
  { _id: false }
);

const ProductVariantSchema = new mongoose.Schema(
  {
    // ==========================================
    // PRODUCT
    // ==========================================

    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },

    // ==========================================
    // SKU
    // ==========================================

    sku: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },

    barcode: {
      type: String,
      default: "",
      trim: true,
    },

    // ==========================================
    // VARIANT NAME
    // Example:
    // Black / 8GB / 256GB
    // ==========================================

    variantName: {
      type: String,
      default: "",
      trim: true,
    },

    // ==========================================
    // DYNAMIC ATTRIBUTES
    // ==========================================

    attributes: [AttributeSchema],

    // Example
    // Color : Black
    // RAM : 8GB
    // Storage : 256GB

    // ==========================================
    // SPECIFICATIONS
    // ==========================================

    specifications: [SpecificationGroupSchema],

    // ==========================================
    // IMAGES
    // ==========================================

    images: [ImageSchema],

    // ==========================================
    // PRICING
    // ==========================================

    pricing: {
      mrp: {
        type: Number,
        required: true,
        min: 0,
      },

      sellingPrice: {
        type: Number,
        required: true,
        min: 0,
      },

      costPrice: {
        type: Number,
        default: 0,
      },

      tax: {
        type: Number,
        default: 0,
      },

      discount: {
        type: Number,
        default: 0,
      },
    },

    // ==========================================
    // INVENTORY
    // ==========================================

    inventory: {
      stock: {
        type: Number,
        default: 0,
      },

      reserved: {
        type: Number,
        default: 0,
      },

      lowStockAlert: {
        type: Number,
        default: 5,
      },
    },

    // ==========================================
    // SHIPPING
    // ==========================================

    shipping: {
      weight: {
        type: Number,
        default: 0 // kg
      },

      dimensions: {
        length: {
          type: Number,
          default: 0 // cm
        },

        breadth: {
          type: Number,
          default: 0 // cm
        },

        height: {
          type: Number,
          default: 0 // cm
        }
      },

      packageType: {
        type: String,
        enum: [
          "box",
          "packet",
          "tube",
          "envelope"
        ],
        default: "box"
      },
      volumetricWeight: {type: Number, default: 0},
    },

    // ==========================================
    // FLAGS
    // ==========================================

    isDefault: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: [
        "active",
        "inactive",
        "out_of_stock",
        "blocked",
      ],
      default: "active",
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// ==========================================
// INDEXES
// ==========================================

ProductVariantSchema.index({
  product: 1,
});

ProductVariantSchema.index({
  sku: 1,
});

ProductVariantSchema.index({
  status: 1,
});

ProductVariantSchema.index({
  "pricing.sellingPrice": 1,
});

ProductVariantSchema.index({
  "inventory.stock": 1,
});

ProductVariantSchema.index({
  isDefault: 1,
});

export const ProductVariant = mongoose.model(
  "ProductVariant",
  ProductVariantSchema
);

