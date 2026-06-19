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


const newProductSchema = new mongoose.Schema(
  {
    title: String,
    slug: String,
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand"
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category"
    },

    subCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubCategory"
    },
    subCategoryLevel2: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubCategoryLevel2",
    },
    description: String,
    highlights: [String],
    specifcation: [
      {
        group: String,
        fields: [
          {
            key: String,
            value: String
          }
        ]
      }
    ],
    tags: [String],
    warranty: String,
    returnPolicy: String,
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref:"Seller"
    },
    status:{
        type:String,
        enum:["draft","active","blocked"],
        default:"draft"
    }
  },{timestamps:true}
)

const ProductVarientSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product"
  },
  sku: {type:String, unique: true},
  attributes: {
    color: String,
    size: String,
    material: String
  },
  images: [
    {url: String, isPrimary: Boolean}
  ],
  mrp: Number,
  sellingPrice: Number,
  costPrice: Number,
  stock: Number,
  reservedStock: Number,
  weight: Number,
  dimensions: {
    length: Number,
    breadth: Number,
    height: Number
  },
  barcode: String,
  status: {
    type: String,
    default: "active"
  }
}, {timestamps: true})

