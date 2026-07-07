import { Category } from "../models/CategoryModel.js";
import { SubCategory } from "../models/SubCategoryModel.js";
import { SubCategory2 } from "../models/SubCategoryLevel2Model.js";
import { ProductVariant } from "../models/ProductVariant.js";
import { Product } from "../models/ProductModel.js";

// export const getAllProduct = async(req, res) => {
//     try {
//         const products = await Product.find({})
//             .populate("category")
//             .populate("subCategory")
//             .populate("subCategoryLevel2");

//         res.json({
//             success: true,
//             products: products
//         })
        
//     } catch (error) {
//         res.json({
//             success: false,
//             message: error.message
//         })        
//     }
// }

export const getAllProduct = async (req, res) => {
  try {
    const products = await ProductVariant.find({
      status: "active",
    })
      .populate({
        path: "product",
        match: {
          isPublished: true,
          status: "active",
        },
        select:
          "title slug brand category subCategory subCategoryLevel2 highlights services",
      })
      .lean();

    const result = products
      .filter((item) => item.product)
      .map((item) => ({
        _id: item._id,

        productId: item.product._id,

        title: item.product.title,

        slug: item.product.slug,

        brand: item.product.brand,

        category: item.product.category,

        subCategory: item.product.subCategory,

        subCategoryLevel2:
          item.product.subCategoryLevel2,

        variantName: item.variantName,

        attributes: item.attributes,

        image:
          item.images.find((i) => i.isPrimary)?.url ||
          item.images[0]?.url,

        pricing: item.pricing,

        stock: item.inventory.stock,

        highlights: item.product.highlights,
      }));

    res.json({
      success: true,
      total: result.length,
      products: result,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const getAllCategory = async (req, res) => {
    try {
        const categories = await Category.find({})
            .populate({
                path: "subCategories",
                populate: {
                    path: "level2Categories"
                }
            });

        res.status(200).json({
            success: true,
            count: categories.length,
            categories
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
export const getNestedSubCategories = async(req, res) => {
    try {
        const { categoryId } = req.params;

        if (!categoryId) {
            return res.status(400).json({
                success: false,
                message: "Category ID is required",
            });
        }

        const categoryTree = await SubCategory.aggregate([
            {
                // Step A: Sirf wahi SubCategories dhundo jo is Main Category se linked hain
                $match: { category: new mongoose.Types.ObjectId(categoryId) }
            },
            {
                // Step B: Left Join (Lookup) subcategorylevel2 collection ke sath
                $lookup: {
                    from: "subcategorylevel2s",          // ⚠️ MongoDB me jo collection ka exact naam ho (usually lowercase plural)
                    localField: "_id",                   // SubCategory ki apni ID
                    foreignField: "subCategory",         // SubCategoryLevel2 model me jo foreign key field hai
                    as: "subCategoryLevel2List"          // Jis array name se output chahiye
                }
            },
            {
                // Step C: Sirf kaam ka data select karne ke liye projection
                $project: {
                    _id: 1,
                    name: 1,
                    image: 1,
                    category: 1,
                    // Level 2 array ke andar se bhi sirf id aur name select karo taaki response heavy na ho
                    subCategoryLevel2List: {
                        _id: 1,
                        name: 1,
                        image: 1
                    }
                }
            }
        ]);

        return res.status(200).json({
            success: true,
            count: categoryTree.length,
            data: categoryTree
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

//  NAYA CONTROLLER: Sirf Category Fragment ke liye jisme deep nesting hai

export const getNestedCategories = async (req, res) => {
    try {
        // Isme hum subCategories ke andar jaakar subCategoryLevel2Ids ko bhi populate kar rahe hain
        const categories = await Category.find({})
            .populate({
                path: "subCategoryIds", // Aapke model ke hisab se jo array name ho
                populate: {
                    path: "subCategoryLevel2Ids" // Level 2 array deep populate
                }
            });

        res.status(200).json({
            success: true,
            count: categories.length,
            categories
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// export const getAllProductByCategory = async (req, res) => {
//     try {
//         const { categoryId } = req.params;

//         const products = await Product.find({category: categoryId})
//         .populate("category")
//         .populate("subCategory")
//         .populate("subCategoryLevel2");

//         res.status(200).json({
//             success: true,
//             count: products.length,
//             products,
//         });

//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: error.message,
//         });
//     }
// };

export const getAllProductByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const variants = await ProductVariant.find({
      status: "active",
    })
      .populate({
        path: "product",
        match: {
          category: categoryId,
          status: "active",
          isPublished: true,
        },
        select:
          "title slug brand category subCategory subCategoryLevel2 highlights",
      })
      .lean();
    //   console.log(JSON.stringify(variants, null, 2));

    const products = variants
      .filter((item) => item.product) // category match hua wahi rahega
      .map((item) => ({
        _id: item._id,
        productId: item.product._id,

        title: item.product.title,
        slug: item.product.slug,

        brand: item.product.brand,

        category: item.product.category,
        subCategory: item.product.subCategory,
        subCategoryLevel2: item.product.subCategoryLevel2,

        variantName: item.variantName,
        attributes: item.attributes,

        image:
          item.images.find((img) => img.isPrimary)?.url ||
          item.images[0]?.url,

        pricing: item.pricing,
        inventory: item.inventory,
      }));

    //   console.log(products)

    return res.status(200).json({
      success: true,
      total: products.length,
      products,
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// export const getProductById = async (req, res) => {
//     try {
//         const { id } = req.params;

//         const product = await Product.findById(id)
//         .populate("category")
//         .populate("subCategory")
//         .populate("subCategoryLevel2");

//         if (!product) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Product not found"
//             });
//         }

//         res.status(200).json({
//             success: true,
//             product
//         });

//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: error.message
//         });
//     }
// };

// export const getProductById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     console.log(id)

//     const variant = await ProductVariant.findById(id)
//       .populate({
//         path: "product",
//         populate: [
//           { path: "category" },
//           { path: "subCategory" },
//           { path: "subCategoryLevel2" },
//         ],
//       })
//       .lean();
//     //   console.log(variant)

//     if (!variant || !variant.product) {
//       return res.status(404).json({
//         success: false,
//         message: "Product not found",
//       });
//     }
//     const allVariants = await ProductVariant.find({
//       product: variant.product._id,
//     })
//       .select(
//         "attributes images pricing.sellingPrice inventory.stock"
//       )
//       .lean();
    
//     const availableAttributes = {};

//     allVariants.forEach((v) => {
//       (v.attributes || []).forEach((attr) => {

//         if (!availableAttributes[attr.name]) {
//           availableAttributes[attr.name] = [];
//         }

//         const alreadyExists = availableAttributes[attr.name].find(
//           (x) => x.value === attr.value
//         );

//         if (!alreadyExists) {
//           availableAttributes[attr.name].push({
//             variantId: v._id,
//             value: attr.value,
//             image: v.images?.[0]?.url || "",
//             price: v.pricing?.sellingPrice || 0,
//             stock: v.inventory?.stock || 0,
//           });
//         }

//       });
//     });

//     const data = {
//       _id: variant._id,
//       productId: variant.product._id,

//       title: variant.product.title,
//       slug: variant.product.slug,
//       description: variant.product.description,
//       shortDescription: variant.product.shortDescription,

//       brand: variant.product.brand,

//       category: {
//         _id: variant.product.category._id,
//         name: variant.product.category.name,
//         image: variant.product.category.image,
//       },

//       subCategory: {
//         _id: variant.product.subCategory._id,
//         name: variant.product.subCategory.name,
//       },

//       subCategoryLevel2: {
//         _id: variant.product.subCategoryLevel2._id,
//         name: variant.product.subCategoryLevel2.name,
//         image: variant.product.subCategoryLevel2.image,
//       },

//       highlights: variant.product.highlights,

//       variantName: variant.variantName,
//       attributes: variant.attributes,
//       specifications: variant.specifications,
//       images: variant.images,
//       variants: allVariants.map(v => ({
//         variantId: v._id,
//         attributes: v.attributes,
//         price: v.pricing.sellingPrice,
//         stock: v.inventory.stock,
//         image: v.images?.[0]?.url
//       })),
//       pricing: variant.pricing,
//       inventory: variant.inventory,
//       shipping: variant.shipping,
//     };

//     console.log(data)

//     return res.status(200).json({
//       success: true,
//       product: data,
//     });

//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };


export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    // Current selected variant
    const variant = await ProductVariant.findById(id)
      .populate({
        path: "product",
        populate: [
          { path: "category" },
          { path: "subCategory" },
          { path: "subCategoryLevel2" },
        ],
      })
      .lean();

    if (!variant || !variant.product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Product ke saare variants
    const allVariants = await ProductVariant.find({
      product: variant.product._id,
    })
      .select(
        "variantName attributes images pricing inventory"
      )
      .lean();

    // =====================================================
    // Build Available Attributes
    // =====================================================

    const availableAttributes = {};

    allVariants.forEach((v) => {
      (v.attributes || []).forEach((attr) => {

        if (!availableAttributes[attr.name]) {
          availableAttributes[attr.name] = [];
        }

        const exists = availableAttributes[attr.name].some(
          (x) => x.value === attr.value
        );

        if (!exists) {
          availableAttributes[attr.name].push({
            variantId: v._id,
            value: attr.value,
            image: v.images?.[0]?.url || "",
            price: v.pricing?.sellingPrice || 0,
            stock: v.inventory?.stock || 0,
          });
        }
      });
    });

    // =====================================================
    // Build Variant List
    // =====================================================

    const variants = allVariants.map((v) => ({
      variantId: v._id,
      variantName: v.variantName,

      attributes: v.attributes,

      image: v.images?.[0]?.url || "",

      price: {
        mrp: v.pricing?.mrp || 0,
        sellingPrice: v.pricing?.sellingPrice || 0,
        discount: v.pricing?.discount || 0,
      },

      stock: v.inventory?.stock || 0,
    }));

    // =====================================================
    // Final Response
    // =====================================================

    const data = {
      _id: variant._id,
      productId: variant.product._id,

      title: variant.product.title,
      slug: variant.product.slug,
      description: variant.product.description,
      shortDescription: variant.product.shortDescription,

      brand: variant.product.brand,

      category: {
        _id: variant.product.category?._id,
        name: variant.product.category?.name,
        image: variant.product.category?.image,
      },

      subCategory: {
        _id: variant.product.subCategory?._id,
        name: variant.product.subCategory?.name,
      },

      subCategoryLevel2: {
        _id: variant.product.subCategoryLevel2?._id,
        name: variant.product.subCategoryLevel2?.name,
        image: variant.product.subCategoryLevel2?.image,
      },

      highlights: variant.product.highlights || [],

      specifications: variant.specifications || [],

      images: variant.images || [],

      pricing: variant.pricing,

      inventory: variant.inventory,

      shipping: variant.shipping,

      // ⭐ Flipkart style attribute selector
      availableAttributes,

      // ⭐ All variants
      variants,
    };

    console.log(JSON.stringify(data, null, 2));

    return res.status(200).json({
      success: true,
      product: data,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const searchProducts = async (req, res) => {
    try {
        const { q } = req.query;

        const products = await Product.find({
        $or: [
            {
            name: {
                $regex: q,
                $options: "i",
            },
            },
            {
            description: {
                $regex: q,
                $options: "i",
            },
            }
        ],
        });

        res.json({
            success: true,
            products,
        });

    } catch (error) {
        res.json({
            success: false,
            message: error.message,
        });
    }
};

