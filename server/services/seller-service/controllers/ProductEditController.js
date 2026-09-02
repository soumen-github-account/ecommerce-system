import axios from "axios";
import { Product } from "../models/ProductModel.js";
import { ProductVariant } from "../models/ProductVariant.js";
import cloudinary from "../config/cloudinary.js";
import { uploadImage } from "../utils/uploadToCloudinary.js";
import { deleteFromCloudinary } from "../utils/cloudinaryDelete.js";

export const getMyProducts = async (req, res) => {
  try {
    // Auth middleware se seller/user ID
    const sellerId = req.seller.id;

    if (!sellerId) {
      return res.status(401).json({
        success: false,
        message: "Seller authentication required",
      });
    }

    const response = await axios.get(
      `${process.env.PRODUCT_SERVICE_URL}/internal/seller/${sellerId}/products`,
    );

    return res.status(200).json({
      success: true,
      ...response.data,
    });
  } catch (error) {
    console.error(
      "[SELLER] GET MY PRODUCTS ERROR:",
      error.response?.data || error.message,
    );

    return res.status(error.response?.status || 500).json({
      success: false,
      message:
        error.response?.data?.message || "Failed to fetch seller products",
    });
  }
};

export const getMyProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const sellerId = req.seller?._id;

    console.log("[SELLER] Seller ID:", sellerId);
    console.log("[SELLER] Variant ID:", id);

    if (!sellerId) {
      return res.status(401).json({
        success: false,
        message: "Seller authentication required",
      });
    }

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    const response = await axios.get(
      `${process.env.PRODUCT_SERVICE_URL}/products/products/${id}`,
    );

    if (!response.data?.success) {
      return res.status(404).json({
        success: false,
        message: response.data?.message || "Product not found",
      });
    }

    const product = response.data.product;

    return res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error(
      "[SELLER] GET PRODUCT BY ID ERROR:",
      error.response?.data || error.message,
    );

    return res.status(error.response?.status || 500).json({
      success: false,
      message: error.response?.data?.message || "Failed to fetch product",
    });
  }
};

export const updateProduct = async (req, res) => {
  const session = await mongoose.startSession();

  let uploadedImages = [];

  try {
    session.startTransaction();

    //--------------------------------------------------
    // PARAMS
    //--------------------------------------------------

    const { id } = req.params;

    if (!id) {
      throw new Error("Product ID is required");
    }

    //--------------------------------------------------
    // SELLER
    //--------------------------------------------------

    const sellerId = req.body.seller;

    if (!sellerId) {
      throw new Error("Seller is required");
    }

    //--------------------------------------------------
    // FIND PRODUCT
    //--------------------------------------------------

    const product = await Product.findOne({
      _id: id,
      seller: sellerId,
    }).session(session);

    if (!product) {
      throw new Error("Product not found or does not belong to this seller.");
    }

    //--------------------------------------------------
    // BODY
    //--------------------------------------------------

    const {
      title,
      shortDescription,
      description,

      brand,

      category,
      subCategory,
      subCategoryLevel2,

      manufacturer,
      countryOfOrigin,

      status,
      seo,
    } = req.body;

    //--------------------------------------------------
    // REQUIRED VALIDATION
    //--------------------------------------------------

    if (!title) throw new Error("Product title is required");

    if (!category) throw new Error("Category is required");

    if (!brand) throw new Error("Brand is required");

    //--------------------------------------------------
    // JSON PARSE
    //--------------------------------------------------

    const highlights = req.body.highlights
      ? JSON.parse(req.body.highlights)
      : [];

    const tags = req.body.tags ? JSON.parse(req.body.tags) : [];

    const services = req.body.services ? JSON.parse(req.body.services) : {};

    const variants = req.body.variants ? JSON.parse(req.body.variants) : [];

    const seoData = seo ? JSON.parse(seo) : {};

    //--------------------------------------------------
    // FORMAT DATA
    //--------------------------------------------------

    const finalHighlights = (highlights || [])
      .map((item) =>
        typeof item === "string" ? item.trim() : item?.value?.trim(),
      )
      .filter(Boolean);

    const finalTags = (tags || [])
      .map((item) =>
        typeof item === "string"
          ? item.toLowerCase().trim()
          : item?.value?.toLowerCase().trim(),
      )
      .filter(Boolean);

    seoData.keywords = (seoData.keywords || [])
      .map((item) =>
        typeof item === "string"
          ? item.toLowerCase().trim()
          : item?.value?.toLowerCase().trim(),
      )
      .filter(Boolean);

    //--------------------------------------------------
    // SLUG
    //--------------------------------------------------

    const slug = slugify(title, {
      lower: true,
      strict: true,
      trim: true,
    });

    //--------------------------------------------------
    // DUPLICATE SLUG
    //--------------------------------------------------

    const slugExist = await Product.findOne({
      slug,
      _id: { $ne: id },
    }).session(session);

    if (slugExist) {
      throw new Error("Another product already exists with this title.");
    }

    //--------------------------------------------------
    // FILE MAP
    //--------------------------------------------------

    const fileMap = {};

    if (req.files?.length) {
      req.files.forEach((file) => {
        if (!fileMap[file.fieldname]) {
          fileMap[file.fieldname] = [];
        }

        fileMap[file.fieldname].push(file);
      });
    }

    //--------------------------------------------------
    // UPDATE PRODUCT
    //--------------------------------------------------

    product.title = title;

    product.slug = slug;

    product.shortDescription = shortDescription || "";

    product.description = description || "";

    product.brand = brand;

    product.category = category;

    product.subCategory = subCategory || null;

    product.subCategoryLevel2 = subCategoryLevel2 || null;

    product.manufacturer = manufacturer || "";

    product.countryOfOrigin = countryOfOrigin || "";

    product.highlights = finalHighlights;

    product.tags = finalTags;

    product.services = services;

    product.seo = seoData;

    product.status = status || product.status;

    //--------------------------------------------------
    // PUBLISHED STATE
    //--------------------------------------------------

    if (status === "active") {
      product.isPublished = true;

      if (!product.publishedAt) {
        product.publishedAt = new Date();
      }
    } else if (status === "draft" || status === "inactive") {
      product.isPublished = false;
    }

    await product.save({
      session,
    });

    //--------------------------------------------------
    // EXISTING VARIANTS
    //--------------------------------------------------

    const existingVariants = await ProductVariant.find({
      product: product._id,
    })
      .session(session)
      .lean();

    const existingVariantMap = new Map(
      existingVariants.map((v) => [v._id.toString(), v]),
    );

    //--------------------------------------------------
    // TRACK VARIANTS
    //--------------------------------------------------

    const incomingVariantIds = [];

    let firstVariantId = null;

    //--------------------------------------------------
    // UPDATE / CREATE VARIANTS
    //--------------------------------------------------

    for (let i = 0; i < variants.length; i++) {
      const variant = variants[i];

      //--------------------------------------------------
      // SKU
      //--------------------------------------------------

      if (!variant.sku) {
        throw new Error(`SKU is required for Variant ${i + 1}`);
      }

      const normalizedSku = variant.sku.toUpperCase().trim();

      //--------------------------------------------------
      // SKU DUPLICATE CHECK
      //--------------------------------------------------

      const skuExist = await ProductVariant.findOne({
        sku: normalizedSku,
        _id: {
          $ne: variant._id || null,
        },
      }).session(session);

      if (skuExist) {
        throw new Error(`SKU ${normalizedSku} already exists`);
      }

      //--------------------------------------------------
      // VARIANT NAME
      //--------------------------------------------------

      const variantName = (variant.attributes || [])
        .map((item) => item.value)
        .filter(Boolean)
        .join(" / ");

      //--------------------------------------------------
      // PRICING
      //--------------------------------------------------

      const mrp = Number(variant.pricing?.mrp || 0);

      const sellingPrice = Number(variant.pricing?.sellingPrice || 0);

      const costPrice = Number(variant.pricing?.costPrice || 0);

      const discount =
        mrp > 0 ? Number((((mrp - sellingPrice) / mrp) * 100).toFixed(2)) : 0;

      //--------------------------------------------------
      // EXISTING VARIANT
      //--------------------------------------------------

      if (variant._id && existingVariantMap.has(variant._id.toString())) {
        const existingVariant = await ProductVariant.findOne({
          _id: variant._id,
          product: product._id,
        }).session(session);

        if (!existingVariant) {
          throw new Error("Variant not found.");
        }

        incomingVariantIds.push(existingVariant._id.toString());

        //--------------------------------------------------
        // OLD IMAGES
        //--------------------------------------------------

        let images = existingVariant.images || [];

        //--------------------------------------------------
        // REMOVE IMAGES
        //--------------------------------------------------

        const removedImages = variant.removedImages || [];

        if (Array.isArray(removedImages) && removedImages.length) {
          for (const publicId of removedImages) {
            try {
              await cloudinary.uploader.destroy(publicId);
            } catch (e) {
              console.error("Cloudinary Delete Error:", e.message);
            }
          }

          images = images.filter(
            (img) => !removedImages.includes(img.public_id),
          );
        }

        //--------------------------------------------------
        // NEW IMAGES
        //--------------------------------------------------

        const variantFiles = fileMap[`variant_${i}`] || [];

        if (variantFiles.length) {
          for (let j = 0; j < variantFiles.length; j++) {
            const file = variantFiles[j];

            const folder = `products/${product._id}`;

            const uploaded = await uploadImage(file, folder);

            uploadedImages.push(uploaded.public_id);

            images.push({
              url: uploaded.secure_url,

              public_id: uploaded.public_id,

              alt: `${title} ${variantName}`,

              isPrimary: false,

              sortOrder: images.length,
            });
          }
        }

        //--------------------------------------------------
        // PRIMARY IMAGE
        //--------------------------------------------------

        if (typeof variant.primaryImageIndex === "number") {
          images = images.map((img, index) => ({
            ...img,

            isPrimary: index === variant.primaryImageIndex,
          }));
        }

        //--------------------------------------------------
        // UPDATE VARIANT
        //--------------------------------------------------

        existingVariant.sku = normalizedSku;

        existingVariant.barcode = variant.barcode || "";

        existingVariant.variantName = variantName;

        existingVariant.attributes = variant.attributes || [];

        existingVariant.specifications = variant.specifications || [];

        existingVariant.images = images;

        existingVariant.pricing = {
          mrp,

          sellingPrice,

          costPrice,

          tax: Number(variant.pricing?.tax || 0),

          discount,
        };

        existingVariant.inventory = {
          stock: Number(variant.inventory?.stock || 0),

          reserved: Number(variant.inventory?.reserved || 0),

          lowStockAlert: Number(variant.inventory?.lowStockAlert || 5),
        };

        existingVariant.shipping = {
          weight: Number(variant.shipping?.weight || 0),

          dimensions: {
            length: Number(variant.shipping?.length || 0),

            breadth: Number(variant.shipping?.breadth || 0),

            height: Number(variant.shipping?.height || 0),
          },

          packageType: variant.shipping?.packageType || "box",

          volumetricWeight: Number(variant.shipping?.volumetricWeight || 0),
        };

        existingVariant.status = variant.status || existingVariant.status;

        existingVariant.isDefault = i === 0;

        await existingVariant.save({
          session,
        });

        if (i === 0) {
          firstVariantId = existingVariant._id;
        }
      }

      //--------------------------------------------------
      // NEW VARIANT
      //--------------------------------------------------
      else {
        const variantFiles = fileMap[`variant_${i}`] || [];

        const images = [];

        for (let j = 0; j < variantFiles.length; j++) {
          const file = variantFiles[j];

          const folder = `products/${product._id}`;

          const uploaded = await uploadImage(file, folder);

          uploadedImages.push(uploaded.public_id);

          images.push({
            url: uploaded.secure_url,

            public_id: uploaded.public_id,

            alt: `${title} ${variantName}`,

            isPrimary: j === (variant.primaryImageIndex || 0),

            sortOrder: j,
          });
        }

        const createdVariants = await ProductVariant.create(
          [
            {
              product: product._id,

              sku: normalizedSku,

              barcode: variant.barcode || "",

              variantName,

              attributes: variant.attributes || [],

              specifications: variant.specifications || [],

              images,

              pricing: {
                mrp,

                sellingPrice,

                costPrice,

                tax: Number(variant.pricing?.tax || 0),

                discount,
              },

              inventory: {
                stock: Number(variant.inventory?.stock || 0),

                reserved: Number(variant.inventory?.reserved || 0),

                lowStockAlert: Number(variant.inventory?.lowStockAlert || 5),
              },

              shipping: {
                weight: Number(variant.shipping?.weight || 0),

                dimensions: {
                  length: Number(variant.shipping?.length || 0),

                  breadth: Number(variant.shipping?.breadth || 0),

                  height: Number(variant.shipping?.height || 0),
                },

                packageType: variant.shipping?.packageType || "box",

                volumetricWeight: Number(
                  variant.shipping?.volumetricWeight || 0,
                ),
              },

              isDefault: i === 0,

              status: variant.status || "active",
            },
          ],
          {
            session,
          },
        );

        const createdVariant = createdVariants[0];

        firstVariantId = firstVariantId || createdVariant._id;

        incomingVariantIds.push(createdVariant._id.toString());
      }
    }

    //--------------------------------------------------
    // DELETE REMOVED VARIANTS
    //--------------------------------------------------

    const variantsToDelete = existingVariants.filter(
      (variant) => !incomingVariantIds.includes(variant._id.toString()),
    );

    for (const variant of variantsToDelete) {
      //--------------------------------------------------
      // DELETE CLOUDINARY IMAGES
      //--------------------------------------------------

      for (const image of variant.images || []) {
        if (!image.public_id) continue;

        try {
          await cloudinary.uploader.destroy(image.public_id);
        } catch (e) {
          console.error("Cloudinary Variant Image Delete Error:", e.message);
        }
      }

      //--------------------------------------------------
      // DELETE VARIANT
      //--------------------------------------------------

      await ProductVariant.deleteOne({
        _id: variant._id,
      }).session(session);
    }

    //--------------------------------------------------
    // VARIANT COUNT
    //--------------------------------------------------

    const variantCount = await ProductVariant.countDocuments({
      product: product._id,
    }).session(session);

    //--------------------------------------------------
    // DEFAULT VARIANT
    //--------------------------------------------------

    if (!firstVariantId) {
      const defaultVariant = await ProductVariant.findOne({
        product: product._id,
      })
        .session(session)
        .sort({
          createdAt: 1,
        });

      firstVariantId = defaultVariant?._id || null;
    }

    //--------------------------------------------------
    // UPDATE PRODUCT VARIANT INFO
    //--------------------------------------------------

    product.defaultVariant = firstVariantId;

    product.variantCount = variantCount;

    await product.save({
      session,
    });

    //--------------------------------------------------
    // COMMIT
    //--------------------------------------------------

    await session.commitTransaction();

    session.endSession();

    //--------------------------------------------------
    // SUCCESS
    //--------------------------------------------------

    return res.status(200).json({
      success: true,

      message: "Product updated successfully.",

      product: {
        _id: product._id,

        title: product.title,

        slug: product.slug,

        variantCount,
      },
    });
  } catch (err) {
    //--------------------------------------------------
    // ROLLBACK
    //--------------------------------------------------

    await session.abortTransaction();

    session.endSession();

    //--------------------------------------------------
    // DELETE NEWLY UPLOADED IMAGES
    //--------------------------------------------------

    if (uploadedImages.length) {
      for (const publicId of uploadedImages) {
        try {
          await cloudinary.uploader.destroy(publicId);
        } catch (e) {
          console.error("Cloudinary Cleanup Error:", e.message);
        }
      }
    }

    //--------------------------------------------------
    // ERROR
    //--------------------------------------------------

    console.error("[PRODUCT] UPDATE PRODUCT ERROR:", err);

    return res.status(500).json({
      success: false,

      message: err.message || "Failed to update product.",
    });
  }
};

export const deleteSellerProduct = async (req, res) => {
  try {
    //--------------------------------------------------
    // PRODUCT ID
    //--------------------------------------------------

    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    //--------------------------------------------------
    // SELLER ID
    //--------------------------------------------------

    const sellerId = req.seller?._id?.toString();

    if (!sellerId) {
      return res.status(401).json({
        success: false,
        message: "Seller authentication required",
      });
    }

    //--------------------------------------------------
    // CALL PRODUCT SERVICE
    //--------------------------------------------------

    const response = await axios.delete(
      `${process.env.PRODUCT_SERVICE_URL}/internal/product-delete/${productId}`,

      {
        data: {
          sellerId,
        },

        headers: {
          "x-internal-service": process.env.INTERNAL_SERVICE_SECRET,
        },
      },
    );

    //--------------------------------------------------
    // RESPONSE
    //--------------------------------------------------

    return res.status(response.status).json(response.data);
  } catch (error) {
    console.error(
      "[SELLER] DELETE PRODUCT ERROR:",
      error.response?.data || error.message,
    );

    //--------------------------------------------------
    // PRODUCT SERVICE RESPONSE
    //--------------------------------------------------

    if (error.response) {
      return res.status(error.response.status).json(error.response.data);
    }

    //--------------------------------------------------
    // SERVICE UNAVAILABLE
    //--------------------------------------------------

    return res.status(503).json({
      success: false,

      message: "Product service unavailable",
    });
  }
};

export const updateSellerVariantStatus = async (req, res) => {
  try {
    //--------------------------------------------------
    // PARAMS
    //--------------------------------------------------

    const { variantId } = req.params;
    console.log(variantId);

    if (!variantId) {
      return res.status(400).json({
        success: false,
        message: "Variant ID is required",
      });
    }

    //--------------------------------------------------
    // SELLER
    //--------------------------------------------------

    const sellerId = req.seller?._id?.toString();

    if (!sellerId) {
      return res.status(401).json({
        success: false,
        message: "Seller authentication required",
      });
    }

    //--------------------------------------------------
    // STATUS
    //--------------------------------------------------

    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    //--------------------------------------------------
    // CALL PRODUCT SERVICE
    //--------------------------------------------------

    const response = await axios.patch(
      `${process.env.PRODUCT_SERVICE_URL}/internal/variants/${variantId}/status`,

      {
        sellerId,
        status,
      },
    );

    //--------------------------------------------------
    // RESPONSE
    //--------------------------------------------------

    return res.status(response.status).json(response.data);
  } catch (error) {
    console.error(
      "[SELLER] UPDATE VARIANT STATUS ERROR:",
      error.response?.data || error.message,
    );

    //--------------------------------------------------
    // PRODUCT SERVICE ERROR
    //--------------------------------------------------

    if (error.response) {
      return res.status(error.response.status).json(error.response.data);
    }

    //--------------------------------------------------
    // SERVICE UNAVAILABLE
    //--------------------------------------------------

    return res.status(503).json({
      success: false,

      message: "Product service unavailable",
    });
  }
};

export const updateSellerProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    // --------------------------------------------------
    // SELLER AUTH
    // --------------------------------------------------

    const sellerId = req.seller?._id?.toString();

    if (!sellerId) {
      return res.status(401).json({
        success: false,
        message: "Seller authentication required",
      });
    }

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
    // BODY
    // --------------------------------------------------

    const updates = req.body;

    if (!updates || Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No update data provided",
      });
    }

    // --------------------------------------------------
    // PRODUCT SERVICE
    // --------------------------------------------------

    const response = await axios.patch(
      `${process.env.PRODUCT_SERVICE_URL}/internal/products/${productId}`,
      {
        sellerId,
        ...updates,
      },
    );

    // --------------------------------------------------
    // RESPONSE
    // --------------------------------------------------

    return res.status(response.status).json(response.data);
  } catch (error) {
    console.error(
      "[SELLER] UPDATE PRODUCT ERROR:",
      error.response?.data || error.message,
    );

    // --------------------------------------------------
    // PRODUCT SERVICE ERROR
    // --------------------------------------------------

    if (error.response) {
      return res.status(error.response.status).json(error.response.data);
    }

    // --------------------------------------------------
    // SERVICE UNAVAILABLE
    // --------------------------------------------------

    return res.status(503).json({
      success: false,
      message: "Product service unavailable",
    });
  }
};

// ==========================================================
// UPDATE SELLER VARIANT
// ==========================================================

// export const updateSellerVariant = async (req, res) => {
//     try {
//         const { variantId } = req.params;

//         // --------------------------------------------------
//         // SELLER AUTH
//         // --------------------------------------------------

//         const sellerId =
//             req.seller?._id?.toString();

//         if (!sellerId) {
//             return res.status(401).json({
//                 success: false,
//                 message:
//                     "Seller authentication required",
//             });
//         }

//         // --------------------------------------------------
//         // PARAM
//         // --------------------------------------------------

//         if (!variantId) {
//             return res.status(400).json({
//                 success: false,
//                 message:
//                     "Variant ID is required",
//             });
//         }

//         // --------------------------------------------------
//         // BODY
//         // --------------------------------------------------

//         const updates = req.body;

//         if (
//             !updates ||
//             Object.keys(updates).length === 0
//         ) {
//             return res.status(400).json({
//                 success: false,
//                 message:
//                     "No update data provided",
//             });
//         }

//         // --------------------------------------------------
//         // PRODUCT SERVICE
//         // --------------------------------------------------

//         const response = await axios.patch(
//             `${process.env.PRODUCT_SERVICE_URL}/internal/variants/${variantId}`,
//             {
//                 sellerId,
//                 ...updates,
//             }
//         );

//         // --------------------------------------------------
//         // RESPONSE
//         // --------------------------------------------------

//         return res
//             .status(response.status)
//             .json(response.data);

//     } catch (error) {

//         console.error(
//             "[SELLER] UPDATE VARIANT ERROR:",
//             error.response?.data ||
//             error.message
//         );

//         // --------------------------------------------------
//         // PRODUCT SERVICE ERROR
//         // --------------------------------------------------

//         if (error.response) {
//             return res
//                 .status(error.response.status)
//                 .json(error.response.data);
//         }

//         // --------------------------------------------------
//         // SERVICE UNAVAILABLE
//         // --------------------------------------------------

//         return res.status(503).json({
//             success: false,
//             message:
//                 "Product service unavailable",
//         });
//     }
// };

export const updateSellerVariant = async (req, res) => {
  try {
    const { variantId } = req.params;

    // =====================================================
    // SELLER AUTH
    // =====================================================

    const sellerId = req.seller?._id?.toString();

    if (!sellerId) {
      return res.status(401).json({
        success: false,
        message: "Seller authentication required",
      });
    }

    if (!variantId) {
      return res.status(400).json({
        success: false,
        message: "Variant ID is required",
      });
    }

    // =====================================================
    // PARSE VARIANT DATA
    // =====================================================

    let updates = {};

    if (req.body?.variantData) {
      try {
        updates = JSON.parse(req.body.variantData);
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: "Invalid variant data",
        });
      }
    } else if (req.body) {
      updates = {
        ...req.body,
      };
    } else {
      return res.status(400).json({
        success: false,
        message: "Request body is missing. Expected multipart/form-data.",
      });
    }
    // =====================================================
    // EXISTING IMAGES
    // =====================================================

    let images = Array.isArray(updates.images)
      ? updates.images.map((image, index) => ({
          url: image.url || "",
          public_id: image.public_id || "",
          alt: image.alt || "",
          isPrimary: Boolean(image.isPrimary),
          sortOrder:
            image.sortOrder !== undefined ? Number(image.sortOrder) : index,
        }))
      : [];

    // =====================================================
    // UPLOAD / REPLACE IMAGES
    // =====================================================

    const uploadedFiles = Array.isArray(req.files) ? req.files : [];

    for (const file of uploadedFiles) {
      const match = file.fieldname.match(/^image_(\d+)$/);

      if (!match) {
        continue;
      }

      const imageIndex = Number(match[1]);

      try {
        // IMPORTANT: PASS COMPLETE FILE OBJECT
        const result = await uploadImage(
          file,
          `products/${productIdSafe(req.body.productId)}/variants/${variantId}`,
        );

        const existingImage = images[imageIndex];

        if (existingImage) {
          const oldPublicId = existingImage.public_id;

          images[imageIndex] = {
            ...existingImage,
            url: result.secure_url,
            public_id: result.public_id,
            alt:
              existingImage.alt ||
              file.originalname ||
              `Product image ${imageIndex + 1}`,
          };

          if (oldPublicId && oldPublicId !== result.public_id) {
            await deleteFromCloudinary(oldPublicId);
          }
        } else {
          images[imageIndex] = {
            url: result.secure_url,
            public_id: result.public_id,
            alt: file.originalname || `Product image ${imageIndex + 1}`,
            isPrimary: images.length === 0,
            sortOrder: imageIndex,
          };
        }
      } catch (uploadError) {
        console.error("[SELLER] CLOUDINARY UPLOAD ERROR:", uploadError);

        return res.status(500).json({
          success: false,
          message: "Failed to upload product image",
        });
      }
    }

    // =====================================================
    // CLEAN IMAGES
    // =====================================================

    images = images
      .filter((image) => image?.url)
      .map((image, index) => ({
        url: image.url,
        public_id: image.public_id || "",
        alt: image.alt || "",
        isPrimary: Boolean(image.isPrimary),
        sortOrder: index,
      }));

    // =====================================================
    // ENSURE ONE PRIMARY IMAGE
    // =====================================================

    if (images.length > 0) {
      const primaryIndex = images.findIndex((image) => image.isPrimary);

      images = images.map((image, index) => ({
        ...image,
        isPrimary: primaryIndex === -1 ? index === 0 : index === primaryIndex,
      }));
    }

    // =====================================================
    // FINAL UPDATES
    // =====================================================

    const finalUpdates = {
      ...updates,
      images,
    };

    delete finalUpdates.variantId;
    delete finalUpdates.sellerId;
    delete finalUpdates.productId;

    // =====================================================
    // PRODUCT SERVICE
    // =====================================================

    const response = await axios.patch(
      `${process.env.PRODUCT_SERVICE_URL}/internal/variants/${variantId}`,
      {
        sellerId,
        ...finalUpdates,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 30000,
      },
    );

    return res.status(response.status).json(response.data);
  } catch (error) {
    console.error(
      "[SELLER] UPDATE VARIANT ERROR:",
      error.response?.data || error.message || error,
    );

    if (error.name === "MulterError") {
      return res.status(400).json({
        success: false,
        message:
          error.code === "LIMIT_FILE_SIZE"
            ? "Image size must be less than 5MB"
            : error.message,
      });
    }

    if (error.response) {
      return res.status(error.response.status).json(error.response.data);
    }

    return res.status(503).json({
      success: false,
      message: "Product service unavailable",
    });
  }
};

// =====================================================
// SAFE PRODUCT ID
// =====================================================

function productIdSafe(productId) {
  if (!productId) {
    return "unknown-product";
  }

  return String(productId).replace(/[^a-zA-Z0-9_-]/g, "");
}
