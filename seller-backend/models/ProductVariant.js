import mongoose from "mongoose";

const ProductVariantSchema = new mongoose.Schema({
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

export const ProductVariant = mongoose.model("ProductVariant", ProductVariantSchema);

