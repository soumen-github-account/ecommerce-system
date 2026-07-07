import { z } from "zod";

// ======================================
// Variant Attribute
// ======================================

const variantAttributeSchema = z.object({
  name: z.string().min(1, "Attribute name is required"),
  value: z.string().min(1, "Attribute value is required"),
});

// ======================================
// Specification Field
// ======================================

const specificationFieldSchema = z.object({
  key: z.string().min(1, "Specification key is required"),
  value: z.string().min(1, "Specification value is required"),
});

// ======================================
// Specification Group
// ======================================

const specificationGroupSchema = z.object({
  group: z.string().min(1, "Group name is required"),

  fields: z.array(specificationFieldSchema).default([]),
});

// ======================================
// Image
// Compatible with File Upload + Existing URL
// ======================================

const imageSchema = z
  .union([
    z.instanceof(File),

    z.object({
      url: z.string().optional(),

      file: z.any().optional(),

      public_id: z.string().optional(),

      alt: z.string().optional(),

      isPrimary: z.boolean().default(false),

      sortOrder: z.number().default(0),
    }),
  ])
  .optional();

// ======================================
// Pricing
// ======================================

const pricingSchema = z
  .object({
    mrp: z.coerce.number().min(1, "MRP is required"),

    sellingPrice: z.coerce.number().min(1, "Selling Price is required"),

    // Frontend me cost use ho raha hai
    costPrice: z.coerce.number().min(0).default(0),

    tax: z.coerce.number().min(0).default(0),

    discount: z.coerce.number().min(0).default(0),
  })
  .superRefine((data, ctx) => {
    if (data.sellingPrice > data.mrp) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Selling Price cannot be greater than MRP",
        path: ["sellingPrice"],
      });
    }

    if (data.sellingPrice < data.cost) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Selling Price must be greater than Cost Price",
        path: ["sellingPrice"],
      });
    }
  });

// ======================================
// Inventory
// ======================================

const inventorySchema = z.object({
  stock: z.coerce.number().min(0).default(0),

  reserved: z.coerce.number().min(0).default(0),

  lowStockAlert: z.coerce.number().min(0).default(5),
});

// ======================================
// Shipping
// ======================================

const shippingSchema = z.object({
  weight: z.coerce.number().min(0).default(0),

  length: z.coerce.number().min(0).default(0),

  breadth: z.coerce.number().min(0).default(0),

  height: z.coerce.number().min(0).default(0),
});

// ======================================
// Variant
// ======================================

export const variantSchema = z.object({
  sku: z.string().min(1, "SKU is required"),

  barcode: z.string().default(""),

  variantName: z.string().default(""),

  attributes: z.array(variantAttributeSchema).default([]),

  // Frontend ke hisaab se
  specifications: z.array(specificationGroupSchema).default([]),

  // File upload compatible
  images: z.array(imageSchema).min(1, "Upload at least one image"),

  pricing: pricingSchema,

  inventory: inventorySchema.default({
    stock: 0,
    reserved: 0,
    lowStockAlert: 5,
  }),

  shipping: shippingSchema.default({
    weight: 0,
    length: 0,
    breadth: 0,
    height: 0,
  }),

  isDefault: z.boolean().default(false),

  status: z
    .enum([
      "active",
      "inactive",
      "out_of_stock",
      "blocked",
    ])
    .default("active"),
});
// ======================================
// Common Chip Schema
// ======================================

const chipSchema = z.object({
  value: z.string().trim().min(1),
});

// ======================================
// Product Schema
// ======================================

export const productSchema = z.object({

  // =========================
  // BASIC
  // =========================

  title: z
    .string()
    .trim()
    .min(3, "Product title is required"),

  slug: z.string(),

  shortDescription: z
    .string()
    .trim()
    .max(500)
    .optional()
    .or(z.literal("")),

  description: z
    .string()
    .trim()
    .min(20, "Description is too short"),

  brand: z
    .string()
    .min(0, "Select Brand"),

  category: z
    .string()
    .min(1, "Select Category"),

  subCategory: z
    .string()
    .optional()
    .or(z.literal("")),

  subCategoryLevel2: z
    .string()
    .optional()
    .or(z.literal("")),

  seller: z
    .string()
    .min(1, "Select Seller"),

  manufacturer: z
    .string()
    .optional()
    .or(z.literal("")),

  countryOfOrigin: z
    .string()
    .optional()
    .or(z.literal("")),

  // =========================
  // Chips
  // =========================

  highlights: z.array(chipSchema).default([]),

  tags: z.array(chipSchema).default([]),

  // =========================
  // SERVICES
  // =========================

  services: z.object({

    returnPolicy: z.object({

      returnable: z.boolean(),

      returnDays: z.coerce.number().min(0),

      returnType: z.enum([
        "replacement",
        "refund",
        "exchange",
        "service-center",
        "no-return",
      ]),

      // React tags input ke liye
      conditions: z
        .array(chipSchema)
        .default([]),

    }),

    cashOnDelivery: z.object({

      available: z.boolean(),

    }),

    warranty: z.object({

      available: z.boolean(),

      duration: z.string().default(""),

      type: z.enum([
        "brand",
        "seller",
        "manufacturer",
        "none",
      ]),

    }),

    support: z.object({

      available: z.boolean(),

      contactType: z.enum([
        "seller",
        "brand",
        "marketplace",
      ]),

    }),

  }),

  // =========================
  // SEO
  // =========================

  seo: z.object({

    metaTitle: z.string().default(""),

    metaDescription: z.string().default(""),

    keywords: z
      .array(chipSchema)
      .default([]),

  }),

  // =========================
  // STATUS
  // =========================

  status: z.enum([
    "draft",
    "active",
    "inactive",
    "blocked",
    "deleted",
  ]),

  // =========================
  // VARIANTS
  // =========================

  variants: z
    .array(variantSchema)
    .min(1, "Add at least one variant"),

});

// import { z } from "zod";

// // ======================================
// // Variant Attribute
// // ======================================

// const variantAttributeSchema = z.object({

//   name: z.string().min(1),

//   value: z.string().min(1)

// });

// // ======================================
// // Specification Field
// // ======================================

// const specificationFieldSchema = z.object({

//   key: z.string().min(1),

//   value: z.string().min(1)

// });

// // ======================================
// // Specification Group
// // ======================================

// const specificationGroupSchema = z.object({

//   group: z.string().min(1),

//   fields: z
//     .array(specificationFieldSchema)
//     .default([])

// });

// // ======================================
// // Image
// // ======================================

// const imageSchema = z.object({

//   url: z.string().optional(),

//   file: z.any().optional(),

//   public_id: z.string().optional(),

//   alt: z.string().optional(),

//   isPrimary: z.boolean().default(false),

//   sortOrder: z.number().default(0)

// });

// // ======================================
// // Pricing
// // ======================================

// const pricingSchema = z.object({

//   mrp: z.coerce
//     .number()
//     .min(1, "MRP is required"),

//   sellingPrice: z.coerce
//     .number()
//     .min(1, "Selling Price is required"),

//   costPrice: z.coerce
//     .number()
//     .min(0),

//   tax: z.coerce
//     .number()
//     .min(0)
//     .default(0),

//   discount: z.coerce
//     .number()
//     .min(0)
//     .default(0)

// });

// // ======================================
// // Inventory
// // ======================================

// const inventorySchema = z.object({

//   stock: z.coerce
//     .number()
//     .min(0),

//   reserved: z.coerce
//     .number()
//     .min(0)
//     .default(0),

//   lowStockAlert: z.coerce
//     .number()
//     .min(0)
//     .default(5)

// });

// // ======================================
// // Shipping
// // ======================================

// const shippingSchema = z.object({

//   weight: z.coerce
//     .number()
//     .min(0),

//   length: z.coerce
//     .number()
//     .min(0),

//   breadth: z.coerce
//     .number()
//     .min(0),

//   height: z.coerce
//     .number()
//     .min(0)

// });

// // ======================================
// // Variant
// // ======================================

// export const variantSchema = z.object({

//   sku: z.string().min(1, "SKU is required"),

//   barcode: z.string().optional(),

//   variantName: z.string().optional(),

//   attributes: z
//     .array(variantAttributeSchema)
//     .default([]),

//   specifications: z
//     .array(specificationGroupSchema)
//     .default([]),

//   images: z
//     .array(imageSchema)
//     .min(1, "Upload at least one image"),

  
//     // ... baaki fields wahi rahengi
//     pricing: pricingSchema.refine((data) => data.sellingPrice <= data.mrp, {
//       message: "Selling Price cannot be greater than MRP",
//       path: ["sellingPrice"],
//     }).refine((data) => data.sellingPrice >= data.costPrice, {
//       message: "Selling Price must be greater than or equal to Cost Price",
//       path: ["sellingPrice"],
//     }),

//   inventory: inventorySchema,

//   shipping: shippingSchema,

//   isDefault: z.boolean().default(false),

//   status: z.enum([
//     "active",
//     "inactive",
//     "out_of_stock",
//     "blocked"
//   ])

// });

// export const productSchema = z.object({

//   // =========================
//   // BASIC
//   // =========================

//   title: z
//     .string()
//     .min(3, "Product title is required"),

//   slug: z.string(),

//   shortDescription: z
//     .string()
//     .max(500)
//     .optional(),

//   description: z
//     .string()
//     .min(20, "Description is too short"),

//   brand: z
//     .string()
//     .min(1, "Select Brand"),

//   category: z
//     .string()
//     .min(1, "Select Category"),

//   subCategory: z
//     .string()
//     .optional(),

//   subCategoryLevel2: z
//     .string()
//     .optional(),

//   seller: z
//     .string()
//     .min(1, "Select Seller"),

//   manufacturer: z.string().optional(),

//   countryOfOrigin: z.string().optional(),

//   highlights: z.array(

//     z.object({

//       value: z.string()

//     })

//   ),

//   tags: z.array(

//     z.object({

//       value: z.string()

//     })

//   ),

//   // =========================
//   // SERVICES
//   // =========================

//   services: z.object({

//     returnPolicy: z.object({

//       returnable: z.boolean(),

//       returnDays: z.coerce.number(),

//       returnType: z.enum([

//         "replacement",
//         "refund",
//         "exchange",
//         "service-center",
//         "no-return"

//       ]),

//       conditions: z.array(z.string())

//     }),

//     cashOnDelivery: z.object({

//       available: z.boolean()

//     }),

//     warranty: z.object({

//       available: z.boolean(),

//       duration: z.string(),

//       type: z.enum([

//         "brand",
//         "seller",
//         "manufacturer",
//         "none"

//       ])

//     }),

//     support: z.object({

//       available: z.boolean(),

//       contactType: z.enum([

//         "seller",
//         "brand",
//         "marketplace"

//       ])

//     })

//   }),

//   // =========================
//   // SEO
//   // =========================

//   seo: z.object({

//     metaTitle: z.string(),

//     metaDescription: z.string(),

//     keywords: z.array(

//       z.object({

//         value: z.string()

//       })

//     )

//   }),

//   // =========================
//   // STATUS
//   // =========================

//   status: z.enum([

//     "draft",
//     "active",
//     "inactive",
//     "blocked",
//     "deleted"

//   ]),

//   // =========================
//   // VARIANTS
//   // =========================

//   variants: z

//     .array(variantSchema)

//     .min(1, "Add at least one variant")

// });