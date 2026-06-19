import { z } from "zod";

export const variantSchema = z.object({
  sku: z.string().min(1, "SKU is required"),

  attributes: z.object({
    color: z.string().optional(),
    size: z.string().optional(),
    material: z.string().optional(),
  }),

  images: z.array(z.any()).default([]),

  mrp: z.coerce.number().min(1, "MRP is required"),

  sellingPrice: z.coerce.number().min(1, "Selling Price is required"),

  costPrice: z.coerce.number().min(0),

  stock: z.coerce.number().min(0),

  reservedStock: z.coerce.number().min(0),

  weight: z.coerce.number().optional(),

  dimensions: z.object({
    length: z.coerce.number().optional(),
    breadth: z.coerce.number().optional(),
    height: z.coerce.number().optional(),
  }),

  barcode: z.string().optional(),
});

export const productSchema = z.object({
  title: z.string().min(3, "Title is required"),

  slug: z.string(),

  brand: z.string().min(1, "Select Brand"),

  category: z.string().min(1, "Select Category"),

  subCategory: z.string().min(1, "Select Sub Category"),

  subCategoryLevel2: z.string().min(1, "Select Level 2"),

  seller: z.string().min(1, "Select Seller"),

  status: z.enum([
    "draft",
    "active",
    "blocked",
  ]),

  description: z
    .string()
    .min(20, "Description too short"),

  // highlights: z.array(z.string()),

  // tags: z.array(z.string()),
  highlights: z.array(z.object({ value: z.string() })),
  tags: z.array(z.object({ value: z.string() })),

  warranty: z.string(),

  returnPolicy: z.string(),

  specification: z.array(
    z.object({
      group: z.string(),

      fields: z.array(
        z.object({
          key: z.string(),
          value: z.string(),
        })
      ),
    })
  ),

  variants: z
    .array(variantSchema)
    .min(1, "At least one variant required"),
});