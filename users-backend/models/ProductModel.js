// import mongoose from "mongoose";

// const ProductSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//       trim: true,
//     },

//     images: [
//       {
//         type: String,
//       },
//     ],

//     category: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Category",
//       required: true,
//     },

//     subCategory: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "SubCategory",
//       required: true,
//     },

//     subCategoryLevel2: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "SubCategoryLevel2",
//       required: true,
//     },

//     unit: {
//       type: String,
//       required: true,
//     },

//     type: [
//       {
//         type: String,
//       },
//     ],

//     stock: {
//       type: Number,
//       default: 0,
//     },

//     price: [
//       {
//         type: Number,
//       },
//     ],

//     discount: {
//       type: Number,
//       default: 0,
//     },

//     description: {
//       type: String,
//       required: true,
//     },

//     details: [
//       {
//         type: String,
//       },
//     ],

//     detailsType: [
//       {
//         type: String,
//       },
//     ],

//     publish: {
//       type: Boolean,
//       default: true,
//     },
//   },
//   {
//     timestamps: true,
//   },
// );

// export const Product = mongoose.model("Product", ProductSchema);


// const newProductSchema = new mongoose.Schema(
//   {
//     title: String,
//     slug: String,
//     brand: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Brand"
//     },
//     category: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Category"
//     },

//     subCategory: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "SubCategory"
//     },
//     subCategoryLevel2: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "SubCategoryLevel2",
//     },
//     description: String,
//     highlights: [String],
//     specifcation: [
//       {
//         group: String,
//         fields: [
//           {
//             key: String,
//             value: String
//           }
//         ]
//       }
//     ],
//     tags: [String],
//     warranty: String,
//     returnPolicy: String,
//     seller: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref:"Seller"
//     },
//     status:{
//         type:String,
//         enum:["draft","active","blocked"],
//         default:"draft"
//     }
//   },{timestamps:true}
// )

// const ProductVarientSchema = new mongoose.Schema({
//   product: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Product"
//   },
//   sku: {type:String, unique: true},
//   attributes: {
//     color: String,
//     size: String,
//     material: String
//   },
//   images: [
//     {url: String, isPrimary: Boolean}
//   ],
//   mrp: Number,
//   sellingPrice: Number,
//   costPrice: Number,
//   stock: Number,
//   reservedStock: Number,
//   weight: Number,
//   dimensions: {
//     length: Number,
//     breadth: Number,
//     height: Number
//   },
//   barcode: String,
//   status: {
//     type: String,
//     default: "active"
//   }
// }, {timestamps: true})



import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    // ============================
    // BASIC INFORMATION
    // ============================

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 250,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    shortDescription: {
      type: String,
      maxlength: 500,
      default: "",
    },

    description: {
      type: String,
      default: "",
    },

    // ============================
    // CATEGORY
    // ============================

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      index: true,
    },

    subCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubCategory",
      default: null,
      index: true,
    },
    subCategoryLevel2: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubCategoryLevel2",
      default: null,
      index: true,
    },

    // ============================
    // BRAND
    // ============================

    brand: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    // ============================
    // SELLER
    // ============================

    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seller",
      required: true,
      index: true,
    },

    // ============================
    // PRODUCT DETAILS
    // ============================

    highlights: [
      {
        type: String,
        trim: true,
      },
    ],

    tags: [
      {
        type: String,
        lowercase: true,
        trim: true,
      },
    ],

    services: {
      returnPolicy: {
        returnable: {
          type: Boolean,
          default: true,
        },

        returnDays: {
          type: Number,
          default: 7,
        },

        returnType: {
          type: String,
          enum: [
            "replacement",
            "refund",
            "exchange",
            "service-center",
            "no-return",
          ],
          default: "replacement",
        },

        conditions: [
          {
            type: String,
          },
        ],
      },

      cashOnDelivery: {
        available: {
          type: Boolean,
          default: true,
        },
      },

      warranty: {
        available: {
          type: Boolean,
          default: false,
        },

        duration: String,

        type: {
          type: String,
          enum: ["brand", "seller", "manufacturer", "none"],
          default: "none",
        },
      },

      support: {
        available: {
          type: Boolean,
          default: true,
        },

        contactType: {
          type: String,
          enum: ["seller", "brand", "marketplace"],
          default: "seller",
        },
      },
    },

    manufacturer: {
      type: String,
      default: "",
    },

    countryOfOrigin: {
      type: String,
      default: "",
    },

    // ============================
    // SEO
    // ============================

    seo: {
      metaTitle: {
        type: String,
        default: "",
      },

      metaDescription: {
        type: String,
        default: "",
      },

      keywords: [
        {
          type: String,
          lowercase: true,
          trim: true,
        },
      ],
    },

    // ============================
    // VARIANTS INFO
    // ============================

    defaultVariant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductVariant",
      default: null,
    },

    variantCount: {
      type: Number,
      default: 0,
    },

    // ============================
    // STATUS
    // ============================

    status: {
      type: String,
      enum: ["draft", "active", "inactive", "blocked", "deleted"],
      default: "draft",
      index: true,
    },

    isPublished: {
      type: Boolean,
      default: false,
      index: true,
    },

    publishedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

// ============================
// INDEXES
// ============================

ProductSchema.index({ slug: 1 });

ProductSchema.index({
  category: 1,
  status: 1,
});

ProductSchema.index({
  seller: 1,
  status: 1,
});

ProductSchema.index({
  brand: 1,
});

ProductSchema.index({
  createdAt: -1,
});

ProductSchema.index({
  tags: 1,
});

// ============================

export const Product = mongoose.model("Product", ProductSchema);
