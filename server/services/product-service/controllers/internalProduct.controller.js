import { ProductVariant } from "../models/ProductVariant.js";
import { Product } from "../models/ProductModel.js";
import { Category } from "../models/CategoryModel.js";
import { SubCategory } from "../models/SubCategoryModel.js";
import { SubCategory2 } from "../models/SubCategoryLevel2Model.js";
import mongoose from "mongoose";
import cloudinary from "../config/cloudinary.js";

export const getOrderProducts = async (req, res) => {
    try {

        const { items } = req.body;

        if (!Array.isArray(items) || !items.length) {
            return res.status(400).json({
                success: false,
                message: "Items are required",
            });
        }

        const result = [];

        for (const item of items) {

            const variant =
                await ProductVariant.findById(
                    item.variantId
                ).populate("product");

            if (!variant || !variant.product) {
                continue;
            }

            const product =
                variant.product;

            result.push({

                productId:
                    product._id,

                variantId:
                    variant._id,

                title:
                    product.title,

                brand:
                    product.brand,

                slug:
                    product.slug,

                manufacturer:
                    product.manufacturer,

                countryOfOrigin:
                    product.countryOfOrigin,

                variantName:
                    variant.variantName,

                sku:
                    variant.sku,

                barcode:
                    variant.barcode,

                image:
                    variant.images?.find(
                        (img) => img.isPrimary
                    )?.url ||
                    variant.images?.[0]?.url ||
                    null,

                images:
                    variant.images || [],

                pricing:
                    variant.pricing,

                inventory:
                    variant.inventory,

                shipping:
                    variant.shipping,

            });
        }

        return res.status(200).json({
            success: true,
            orderItems: result,
        });

    } catch (error) {

        console.error(
            "[PRODUCT] GET ORDER PRODUCTS ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const getOrderProductsInternal = async (req, res) => {

    try {

        const { items } = req.body;

        if (!Array.isArray(items)) {

            return res.status(400).json({
                success: false,
                message: "Items must be an array",
            });

        }


        const productIds =
            items
                .map((item) => item.productId)
                .filter(Boolean);


        const products =
            await Product.find({
                _id: {
                    $in: productIds,
                },
            })
            .select(
                "title brand slug"
            )
            .lean();


        // Variant bhi tumhare Product Service
        // ke actual model ke according fetch karo.


        return res.status(200).json({

            success: true,

            products,

        });

    } catch (error) {

        console.error(
            "[PRODUCT] INTERNAL ORDER PRODUCTS ERROR:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                error.message,

        });

    }

};


// export const getSellerProductsInternal = async (req, res) => {
//     try {
//         const { sellerId } = req.params;

//         if (!sellerId) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Seller ID is required",
//             });
//         }

//         // ==========================================
//         // 1. GET SELLER'S PRODUCTS
//         // ==========================================

//         const products = await Product.find({
//             seller: sellerId,
//         })
//             .populate({
//                 path: "category",
//                 select: "name",
//             })
//             .populate({
//                 path: "subCategory",
//                 select: "name",
//             })
//             .populate({
//                 path: "subCategoryLevel2",
//                 select: "name",
//             })
//             .lean();


//         if (!products.length) {
//             return res.status(200).json({
//                 success: true,
//                 count: 0,
//                 products: [],
//             });
//         }

//         const productIds = products.map(
//             (product) => product._id
//         );


//         const variants = await ProductVariant.find({
//             product: {
//                 $in: productIds,
//             },
//         })
//             .lean();

//         const productMap = new Map(
//             products.map((product) => [
//                 product._id.toString(),
//                 product,
//             ])
//         );

//         const result = variants
//             .map((variant) => {
//                 const product = productMap.get(
//                     variant.product.toString()
//                 );

//                 if (!product) {
//                     return null;
//                 }

//                 return {
//                     productId: product._id,
//                     title: product.title,
//                     brand: product.brand,
//                     slug: product.slug,
//                     manufacturer: product.manufacturer,
//                     countryOfOrigin: product.countryOfOrigin,
//                     productStatus: product.status,
//                     isPublished: product.isPublished,

//                     category: product.category
//                         ? {
//                             _id: product.category._id,
//                             name: product.category.name,
//                           }
//                         : null,

//                     subCategory:
//                         product.subCategory
//                             ? {
//                                   _id:
//                                       product
//                                           .subCategory
//                                           ._id,
//                                   name:
//                                       product
//                                           .subCategory
//                                           .name,
//                               }
//                             : null,

//                     subCategoryLevel2:
//                         product.subCategoryLevel2
//                             ? {
//                                   _id:
//                                       product
//                                           .subCategoryLevel2
//                                           ._id,
//                                   name:
//                                       product
//                                           .subCategoryLevel2
//                                           .name,
//                               }
//                             : null,
//                     variantId: variant._id,
//                     variantName: variant.variantName,
//                     sku: variant.sku,
//                     barcode: variant.barcode,
//                     image:
//                         variant.images?.find(
//                             (img) =>
//                                 img.isPrimary
//                         )?.url ||
//                         variant.images?.[0]?.url ||
//                         null,
//                     images: variant.images || [],
//                     pricing: variant.pricing,
//                     inventory: variant.inventory,
//                     status: variant.status,
//                     shipping: variant.shipping,
//                     createdAt: variant.createdAt,
//                     updatedAt: variant.updatedAt,
//                 };
//             })
//             .filter(Boolean);

//         const totalProducts = products.length;

//         const activeProducts = products.filter(
//             (product) => product.status === "active"
//         ).length;

//         const draftProducts = products.filter(
//             (product) => product.status === "draft"
//         ).length;

//         const variantsByProduct = new Map();

//         for (const variant of variants) {
//             const productId = variant.product.toString();

//             if (!variantsByProduct.has(productId)) {
//                 variantsByProduct.set(productId, []);
//             }

//             variantsByProduct
//                 .get(productId)
//                 .push(variant);
//         }

//         const outOfStockProducts = products.filter(
//             (product) => {
//                 const productVariants =
//                     variantsByProduct.get(
//                         product._id.toString()
//                     ) || [];

//                 if (!productVariants.length) {
//                     return true;
//                 }

//                 return productVariants.every(
//                     (variant) =>
//                         (variant.inventory?.stock || 0) <= 0
//                 );
//             }
//         ).length;

//         return res.status(200).json({
//             success: true,
//             stats: {
//                 totalProducts,
//                 activeProducts,
//                 outOfStockProducts,
//                 draftProducts,
//             },
//             count: result.length,
//             products: result,
//         });

//     } catch (error) {
//         console.error(
//             "[PRODUCT] GET SELLER PRODUCTS INTERNAL ERROR:",
//             error
//         );

//         return res.status(500).json({
//             success: false,
//             message: error.message,
//         });
//     }
// };


export const deleteProductInternal = async (req, res) => {

    const session = await mongoose.startSession();

    try {

        session.startTransaction();

        //--------------------------------------------------
        // PRODUCT ID
        //--------------------------------------------------

        const { productId } = req.params;

        if (!productId) {

            return res.status(400).json({
                success: false,
                message: "Product ID is required"
            });

        }

        //--------------------------------------------------
        // SELLER ID
        //--------------------------------------------------

        const { sellerId } = req.body;

        if (!sellerId) {

            return res.status(400).json({
                success: false,
                message: "Seller ID is required"
            });

        }

        //--------------------------------------------------
        // FIND PRODUCT
        //--------------------------------------------------

        const product = await Product.findOne({
            _id: productId,
            seller: sellerId
        })
            .session(session)
            .lean();

        if (!product) {

            await session.abortTransaction();
            session.endSession();

            return res.status(404).json({
                success: false,
                message:
                    "Product not found or does not belong to this seller"
            });

        }

        //--------------------------------------------------
        // FIND ALL VARIANTS
        //--------------------------------------------------

        const variants = await ProductVariant.find({
            product: product._id
        })
            .session(session)
            .lean();

        //--------------------------------------------------
        // DELETE CLOUDINARY IMAGES
        //--------------------------------------------------

        for (const variant of variants) {

            for (const image of variant.images || []) {

                if (!image.public_id)
                    continue;

                try {

                    await cloudinary.uploader.destroy(
                        image.public_id
                    );

                } catch (error) {

                    console.error(
                        "[PRODUCT] CLOUDINARY DELETE ERROR:",
                        error.message
                    );

                }

            }

        }

        //--------------------------------------------------
        // DELETE VARIANTS
        //--------------------------------------------------

        const variantDeleteResult =
            await ProductVariant.deleteMany({
                product: product._id
            }).session(session);

        //--------------------------------------------------
        // DELETE PRODUCT
        //--------------------------------------------------

        await Product.deleteOne({
            _id: product._id
        }).session(session);

        //--------------------------------------------------
        // COMMIT
        //--------------------------------------------------

        await session.commitTransaction();

        session.endSession();

        //--------------------------------------------------
        // RESPONSE
        //--------------------------------------------------

        return res.status(200).json({

            success: true,

            message:
                "Product deleted successfully",

            deletedProductId:
                product._id,

            deletedVariants:
                variantDeleteResult.deletedCount

        });

    } catch (error) {

        //--------------------------------------------------
        // ROLLBACK
        //--------------------------------------------------

        await session.abortTransaction();

        session.endSession();

        console.error(
            "[PRODUCT] DELETE PRODUCT INTERNAL ERROR:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                error.message ||
                "Failed to delete product"

        });

    }
};

export const updateVariantStatusInternal = async (req, res) => {

    try {

        //--------------------------------------------------
        // PARAMS
        //--------------------------------------------------

        const { variantId } = req.params;

        if (!variantId) {

            return res.status(400).json({
                success: false,
                message: "Variant ID is required"
            });

        }

        //--------------------------------------------------
        // BODY
        //--------------------------------------------------

        const { status, sellerId } = req.body;

        if (!sellerId) {

            return res.status(400).json({
                success: false,
                message: "Seller ID is required"
            });

        }

        //--------------------------------------------------
        // VALID STATUS
        //--------------------------------------------------

        const allowedStatuses = [
            "active",
            "inactive",
            "out_of_stock",
            "blocked"
        ];

        if (!allowedStatuses.includes(status)) {

            return res.status(400).json({
                success: false,
                message: "Invalid variant status",
                allowedStatuses
            });

        }

        //--------------------------------------------------
        // FIND VARIANT + PRODUCT
        //--------------------------------------------------

        const variant =
            await ProductVariant.findById(
                variantId
            ).populate({
                path: "product",
                select: "seller title"
            });

        if (!variant) {

            return res.status(404).json({
                success: false,
                message: "Variant not found"
            });

        }

        //--------------------------------------------------
        // SELLER OWNERSHIP
        //--------------------------------------------------

        if (
            !variant.product ||
            variant.product.seller.toString() !==
            sellerId.toString()
        ) {

            return res.status(403).json({
                success: false,
                message:
                    "You are not authorized to update this variant"
            });

        }

        //--------------------------------------------------
        // UPDATE STATUS
        //--------------------------------------------------

        variant.status = status;

        await variant.save();

        //--------------------------------------------------
        // RESPONSE
        //--------------------------------------------------

        return res.status(200).json({

            success: true,

            message:
                "Variant status updated successfully",

            variant: {

                _id:
                    variant._id,

                productId:
                    variant.product._id,

                sku:
                    variant.sku,

                status:
                    variant.status

            }

        });

    } catch (error) {

        console.error(
            "[PRODUCT] UPDATE VARIANT STATUS ERROR:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                error.message ||
                "Failed to update variant status"

        });

    }

};

export const getSellerProductsInternal = async (req, res) => {
  try {
    const { sellerId } = req.params;

    if (!sellerId) {
      return res.status(400).json({
        success: false,
        message: "Seller ID is required",
      });
    }

    // --------------------------------------------------
    // GET PRODUCTS
    // --------------------------------------------------

    const products = await Product.find({
      seller: sellerId,
      status: { $ne: "deleted" },
    })
      .populate({
        path: "category",
        select: "name image",
      })
      .populate({
        path: "subCategory",
        select: "name",
      })
      .populate({
        path: "subCategoryLevel2",
        select: "name image",
      })
      .sort({ createdAt: -1 })
      .lean();

    if (!products.length) {
      return res.status(200).json({
        success: true,
        count: 0,
        products: [],
      });
    }

    // --------------------------------------------------
    // GET ALL VARIANTS
    // --------------------------------------------------

    const productIds = products.map((product) => product._id);

    const variants = await ProductVariant.find({
      product: { $in: productIds },
    })
      .select(
        `
        product
        sku
        barcode
        variantName
        attributes
        specifications
        images
        pricing
        inventory
        shipping
        isDefault
        status
        createdAt
        updatedAt
        `
      )
      .sort({ isDefault: -1, createdAt: 1 })
      .lean();

    // --------------------------------------------------
    // ATTACH VARIANTS TO PRODUCTS
    // --------------------------------------------------

    const productsWithVariants = products.map((product) => {
      const productVariants = variants.filter(
        (variant) =>
          variant.product.toString() === product._id.toString()
      );

      return {
        ...product,

        variantCount: productVariants.length,

        variants: productVariants,
      };
    });

    // --------------------------------------------------
    // RESPONSE
    // --------------------------------------------------

    return res.status(200).json({
      success: true,
      count: productsWithVariants.length,
      products: productsWithVariants,
    });
  } catch (error) {
    console.error(
      "[PRODUCT] GET SELLER PRODUCTS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to get seller products",
    });
  }
};

export const updateProductInternal = async (req, res) => {
    try {
        const { productId } = req.params;
        const { sellerId, ...updates } = req.body;

        // --------------------------------------------------
        // PARAM
        // --------------------------------------------------

        if (!productId) {
            return res.status(400).json({
                success: false,
                message: "Product ID is required",
            });
        }

        // --------------------------------------------------
        // SELLER
        // --------------------------------------------------

        if (!sellerId) {
            return res.status(400).json({
                success: false,
                message: "Seller ID is required",
            });
        }

        // --------------------------------------------------
        // ALLOWED FIELDS
        // --------------------------------------------------

        const allowedFields = [
            "title",
            "slug",
            "shortDescription",
            "description",
            "category",
            "subCategory",
            "subCategoryLevel2",
            "brand",
            "highlights",
            "tags",
            "services",
            "manufacturer",
            "countryOfOrigin",
            "seo",
        ];

        const safeUpdates = {};

        for (const field of allowedFields) {
            if (updates[field] !== undefined) {
                safeUpdates[field] = updates[field];
            }
        }

        // --------------------------------------------------
        // CHECK PRODUCT OWNERSHIP
        // --------------------------------------------------

        const product = await Product.findOne({
            _id: productId,
            seller: sellerId,
        });

        if (!product) {
            return res.status(404).json({
                success: false,
                message:
                    "Product not found or you are not authorized",
            });
        }

        // --------------------------------------------------
        // UPDATE
        // --------------------------------------------------

        Object.assign(product, safeUpdates);

        await product.save();

        // --------------------------------------------------
        // RESPONSE
        // --------------------------------------------------

        return res.status(200).json({
            success: true,
            message: "Product updated successfully",
            product,
        });
    } catch (error) {
        console.error(
            "[PRODUCT] UPDATE PRODUCT ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                error.message ||
                "Failed to update product",
        });
    }
};

// ==========================================================
// UPDATE VARIANT INTERNAL
// ==========================================================

// export const updateVariantInternal = async (req, res) => {
//     try {
//         const { variantId } = req.params;

//         const {
//             sellerId,
//             ...updates
//         } = req.body;

//         // --------------------------------------------------
//         // PARAM
//         // --------------------------------------------------

//         if (!variantId) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Variant ID is required",
//             });
//         }

//         // --------------------------------------------------
//         // SELLER
//         // --------------------------------------------------

//         if (!sellerId) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Seller ID is required",
//             });
//         }

//         // --------------------------------------------------
//         // FIND VARIANT + PRODUCT
//         // --------------------------------------------------

//         const variant =
//             await ProductVariant.findById(variantId);

//         if (!variant) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Variant not found",
//             });
//         }

//         // --------------------------------------------------
//         // CHECK PRODUCT OWNERSHIP
//         // --------------------------------------------------

//         const product = await Product.findOne({
//             _id: variant.product,
//             seller: sellerId,
//         });

//         if (!product) {
//             return res.status(403).json({
//                 success: false,
//                 message:
//                     "You are not authorized to update this variant",
//             });
//         }

//         // --------------------------------------------------
//         // ALLOWED FIELDS
//         // --------------------------------------------------

//         const allowedFields = [
//             "barcode",
//             "variantName",
//             "attributes",
//             "specifications",
//             "images",
//             "pricing",
//             "inventory",
//             "shipping",
//             "isDefault",
//             "status",
//         ];

//         const safeUpdates = {};

//         for (const field of allowedFields) {
//             if (updates[field] !== undefined) {
//                 safeUpdates[field] = updates[field];
//             }
//         }

//         // --------------------------------------------------
//         // UPDATE
//         // --------------------------------------------------

//         Object.assign(
//             variant,
//             safeUpdates
//         );

//         await variant.save();

//         // --------------------------------------------------
//         // RESPONSE
//         // --------------------------------------------------

//         return res.status(200).json({
//             success: true,
//             message:
//                 "Variant updated successfully",
//             variant,
//         });
//     } catch (error) {
//         console.error(
//             "[PRODUCT] UPDATE VARIANT ERROR:",
//             error
//         );

//         return res.status(500).json({
//             success: false,
//             message:
//                 error.message ||
//                 "Failed to update variant",
//         });
//     }
// };

export const updateVariantInternal = async (req, res) => {
  try {
    const { variantId } = req.params;

    const {
      sellerId,
      ...updates
    } = req.body;

    // =====================================================
    // PARAM
    // =====================================================

    if (!variantId) {
      return res.status(400).json({
        success: false,
        message: "Variant ID is required",
      });
    }

    // =====================================================
    // SELLER
    // =====================================================

    if (!sellerId) {
      return res.status(400).json({
        success: false,
        message: "Seller ID is required",
      });
    }

    // =====================================================
    // FIND VARIANT
    // =====================================================

    const variant =
      await ProductVariant.findById(variantId);

    if (!variant) {
      return res.status(404).json({
        success: false,
        message: "Variant not found",
      });
    }

    // =====================================================
    // CHECK PRODUCT OWNERSHIP
    // =====================================================

    const product = await Product.findOne({
      _id: variant.product,
      seller: sellerId,
    });

    if (!product) {
      return res.status(403).json({
        success: false,
        message:
          "You are not authorized to update this variant",
      });
    }

    // =====================================================
    // ALLOWED FIELDS
    // =====================================================

    const allowedFields = [
      "barcode",
      "variantName",
      "attributes",
      "specifications",
      "images",
      "pricing",
      "inventory",
      "shipping",
      "isDefault",
      "status",
    ];

    const safeUpdates = {};

    for (const field of allowedFields) {
      if (updates[field] !== undefined) {
        safeUpdates[field] = updates[field];
      }
    }

    // =====================================================
    // VALIDATE PRICING
    // =====================================================

    if (safeUpdates.pricing) {
      safeUpdates.pricing = {
        mrp: Number(
          safeUpdates.pricing.mrp ?? 0
        ),

        sellingPrice: Number(
          safeUpdates.pricing.sellingPrice ?? 0
        ),

        costPrice: Number(
          safeUpdates.pricing.costPrice ?? 0
        ),

        tax: Number(
          safeUpdates.pricing.tax ?? 0
        ),

        discount: Number(
          safeUpdates.pricing.discount ?? 0
        ),
      };
    }

    // =====================================================
    // VALIDATE INVENTORY
    // =====================================================

    if (safeUpdates.inventory) {
      safeUpdates.inventory = {
        stock: Number(
          safeUpdates.inventory.stock ?? 0
        ),

        reserved: Number(
          safeUpdates.inventory.reserved ?? 0
        ),

        lowStockAlert: Number(
          safeUpdates.inventory.lowStockAlert ?? 5
        ),
      };
    }

    // =====================================================
    // VALIDATE SHIPPING
    // =====================================================

    if (safeUpdates.shipping) {
      safeUpdates.shipping = {
        weight: Number(
          safeUpdates.shipping.weight ?? 0
        ),

        dimensions: {
          length: Number(
            safeUpdates.shipping.dimensions?.length ?? 0
          ),

          breadth: Number(
            safeUpdates.shipping.dimensions?.breadth ?? 0
          ),

          height: Number(
            safeUpdates.shipping.dimensions?.height ?? 0
          ),
        },

        packageType:
          safeUpdates.shipping.packageType ||
          "box",

        volumetricWeight: Number(
          safeUpdates.shipping.volumetricWeight ?? 0
        ),
      };
    }

    // =====================================================
    // VALIDATE IMAGES
    // =====================================================

    if (safeUpdates.images) {
      if (!Array.isArray(safeUpdates.images)) {
        return res.status(400).json({
          success: false,
          message: "Images must be an array",
        });
      }

      safeUpdates.images =
        safeUpdates.images.map(
          (image, index) => ({
            url: image.url || "",
            public_id:
              image.public_id || "",
            alt: image.alt || "",
            isPrimary:
              Boolean(image.isPrimary),
            sortOrder:
              Number(
                image.sortOrder ?? index
              ),
          })
        );
    }

    // =====================================================
    // UPDATE
    // =====================================================

    Object.assign(
      variant,
      safeUpdates
    );

    await variant.save();

    // =====================================================
    // RESPONSE
    // =====================================================

    return res.status(200).json({
      success: true,
      message:
        "Variant updated successfully",
      variant,
    });
  } catch (error) {
    console.error(
      "[PRODUCT] UPDATE VARIANT ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to update variant",
    });
  }
};


/// for dashboard


export const getSellerLowStock = async (req, res) => {
    try {
        const { sellerId } = req.params;

        const limit = Math.min(
            Number(req.query.limit) || 10,
            50
        );

        if (!sellerId) {
            return res.status(400).json({
                success: false,
                message: "Seller ID is required",
            });
        }

        if (!mongoose.Types.ObjectId.isValid(sellerId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid seller ID",
            });
        }

        const sellerObjectId =
            new mongoose.Types.ObjectId(sellerId);

        const products = await ProductVariant.aggregate([
            /**
             * ProductVariant
             */
            {
                $match: {
                    status: {
                        $in: [
                            "active",
                            "out_of_stock",
                        ],
                    },
                },
            },

            /**
             * Product lookup
             */
            {
                $lookup: {
                    from: "products",
                    localField: "product",
                    foreignField: "_id",
                    as: "productData",
                },
            },

            {
                $unwind: "$productData",
            },

            /**
             * Seller filter
             */
            {
                $match: {
                    "productData.seller":
                        sellerObjectId,
                },
            },

            /**
             * Low stock filter
             */
            {
                $match: {
                    $expr: {
                        $lte: [
                            "$inventory.stock",
                            "$inventory.lowStockAlert",
                        ],
                    },
                },
            },

            /**
             * Lowest stock first
             */
            {
                $sort: {
                    "inventory.stock": 1,
                },
            },

            {
                $limit: limit,
            },

            /**
             * Response
             */
            {
                $project: {
                    _id: 0,

                    productId: "$product",

                    variantId: "$_id",

                    sku: 1,

                    variantName: 1,

                    title: "$productData.title",

                    brand: "$productData.brand",

                    stock: "$inventory.stock",

                    lowStockAlert:
                        "$inventory.lowStockAlert",

                    sellingPrice:
                        "$pricing.sellingPrice",

                    status: 1,

                    image: {
                        $let: {
                            vars: {
                                primaryImage: {
                                    $arrayElemAt: [
                                        {
                                            $filter: {
                                                input: "$images",
                                                as: "img",
                                                cond: {
                                                    $eq: [
                                                        "$$img.isPrimary",
                                                        true,
                                                    ],
                                                },
                                            },
                                        },
                                        0,
                                    ],
                                },
                            },

                            in: "$$primaryImage.url",
                        },
                    },
                },
            },
        ]);

        return res.status(200).json({
            success: true,

            count: products.length,

            products,
        });
    } catch (error) {
        console.error(
            "Product dashboard low stock error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to fetch low stock products",
            error: error.message,
        });
    }
};


// internalProduct.controller.js

export const reduceStockInternal = async (
    req,
    res
) => {

    try {

        const {
            orderId,
            items
        } = req.body;


        if (
            !orderId ||
            !Array.isArray(items)
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid stock request"

            });

        }


        // YAHAN Product / ProductVariant model use hoga
        // because Product Service owns these models.


        for (const item of items) {

            const product =
                await Product.findById(
                    item.product
                ).session(mongoSession);

            if (!product)
                continue;

            // Variant stock update
            // Next phase me karenge
        }


        return res.status(200).json({

            success: true,

            message:
                "Stock updated successfully",

            orderId

        });

    }
    catch (error) {

        return res.status(500).json({

            success: false,

            message:
                error.message

        });

    }
};