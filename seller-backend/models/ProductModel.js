import mongoose from "mongoose"

const ProductSchema = new mongoose.Schema(
  {
    title: String,
    slug: String,
    // brand: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Brand"
    // },
    brand: String,
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

export const Product = mongoose.model("Product", ProductSchema);

