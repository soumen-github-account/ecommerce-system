import mongoose from "mongoose";
import slugify from "slugify";
import { uploadImage } from "../utils/uploadToCloudinary.js";
import { Seller } from "../models/SellerModel.js";
import { Product } from "../models/ProductModel.js"
import { ProductVariant } from "../models/ProductVariant.js"

export const addProduct = async (req, res) => {
    const session = await mongoose.startSession();

    let uploadedImages = [];

    try {

        session.startTransaction();

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

            seller,

            status,

            seo

        } = req.body;

        //--------------------------------------------------
        // REQUIRED VALIDATION
        //--------------------------------------------------

        if (!title)
            throw new Error("Product title is required");

        if (!category)
            throw new Error("Category is required");

        if (!brand)
            throw new Error("Brand is required");

        if (!seller)
            throw new Error("Seller is required");

        //--------------------------------------------------
        // JSON PARSE
        //--------------------------------------------------

        const highlights = req.body.highlights
            ? JSON.parse(req.body.highlights)
            : [];

        const tags = req.body.tags
            ? JSON.parse(req.body.tags)
            : [];

        const services = req.body.services
            ? JSON.parse(req.body.services)
            : {};

        const variants = req.body.variants
            ? JSON.parse(req.body.variants)
            : [];

        const seoData = seo
            ? JSON.parse(seo)
            : {};

        //--------------------------------------------------
        // FORMAT DATA
        //--------------------------------------------------

        const finalHighlights = (highlights || [])
            .map(item =>
                typeof item === "string"
                    ? item.trim()
                    : item?.value?.trim()
            )
            .filter(Boolean);

        const finalTags = (tags || [])
            .map(item =>
                typeof item === "string"
                    ? item.toLowerCase().trim()
                    : item?.value?.toLowerCase().trim()
            )
            .filter(Boolean);

        seoData.keywords = (seoData.keywords || [])
            .map(item =>
                typeof item === "string"
                    ? item.toLowerCase().trim()
                    : item?.value?.toLowerCase().trim()
            )
            .filter(Boolean);

        //--------------------------------------------------
        // SLUG
        //--------------------------------------------------

        const slug = slugify(title, {
            lower: true,
            strict: true,
            trim: true
        });

        //--------------------------------------------------
        // DUPLICATE SLUG
        //--------------------------------------------------

        const slugExist = await Product.findOne({
            slug
        });

        if (slugExist) {
            throw new Error("Product already exists.");
        }

        //--------------------------------------------------
        // CREATE PRODUCT
        //--------------------------------------------------

        const products = await Product.create(
            [
                {
                    title,

                    slug,

                    shortDescription,

                    description,

                    brand,

                    category,

                    subCategory:
                        subCategory || null,

                    subCategoryLevel2:
                        subCategoryLevel2 || null,

                    seller,

                    manufacturer,

                    countryOfOrigin,

                    highlights: finalHighlights,

                    tags: finalTags,

                    services,

                    seo: seoData,

                    status:
                        status || "draft",

                    isPublished: false
                }
            ],
            {
                session
            }
        );

        const createdProduct = products[0];

        //--------------------------------------------------
        // FILE MAP
        //--------------------------------------------------

        const fileMap = {};

        if (req.files?.length) {

            req.files.forEach(file => {

                if (!fileMap[file.fieldname]) {

                    fileMap[file.fieldname] = [];

                }

                fileMap[file.fieldname].push(file);

            });

        }

        //--------------------------------------------------
        // NEXT PART
        //--------------------------------------------------
                //--------------------------------------------------
        // SAVE VARIANTS
        //--------------------------------------------------

        let firstVariant = null;

        for (let i = 0; i < variants.length; i++) {

            const variant = variants[i];

            //--------------------------------------------
            // SKU REQUIRED
            //--------------------------------------------

            if (!variant.sku) {
                throw new Error(`SKU is required for Variant ${i + 1}`);
            }

            //--------------------------------------------
            // DUPLICATE SKU
            //--------------------------------------------

            const skuExist = await ProductVariant.findOne({
                sku: variant.sku.toUpperCase()
            });

            if (skuExist) {
                throw new Error(
                    `SKU ${variant.sku} already exists`
                );
            }

            //--------------------------------------------
            // VARIANT NAME
            //--------------------------------------------

            const variantName =
                (variant.attributes || [])
                    .map(item => item.value)
                    .filter(Boolean)
                    .join(" / ");

            //--------------------------------------------
            // DISCOUNT
            //--------------------------------------------

            const mrp =
                Number(
                    variant.pricing?.mrp || 0
                );

            const sellingPrice =
                Number(
                    variant.pricing?.sellingPrice || 0
                );

            const costPrice =
                Number(
                    variant.pricing?.costPrice || 0
                );

            const discount =
                mrp > 0
                    ? Number(
                        (
                            ((mrp - sellingPrice) / mrp) * 100
                        ).toFixed(2)
                    )
                    : 0;

            //--------------------------------------------
            // UPLOAD IMAGES
            //--------------------------------------------

            const variantFiles =
                fileMap[`variant_${i}`] || [];

            const images = [];

            for (let j = 0; j < variantFiles.length; j++) {

                const file = variantFiles[j];

                // const uploaded = await uploadImage(

                //     file,

                //     `products/${createdProduct._id}/${variantName || "default"}`
                // );
                const folder = `products/${createdProduct._id}`;

                const uploaded = await uploadImage(file, folder);

                uploadedImages.push(uploaded.public_id);

                images.push({

                    url: uploaded.secure_url,

                    public_id: uploaded.public_id,

                    alt:
                        `${title} ${variantName}`,

                    isPrimary:
                        j ===
                        (
                            variant.primaryImageIndex || 0
                        ),

                    sortOrder: j

                });

            }
            // const specifications = (variant.specifications || []).map(group => ({
            //     group: group.group,
            //     fields: (group.fields || []).map(field => ({
            //         key: field.key,
            //         value: field.value,
            //     })),
            // }));
            const specifications = variant.specifications || [];

            //--------------------------------------------
            // CREATE VARIANT
            //--------------------------------------------

            const createdVariants =
                await ProductVariant.create(
                    [
                        {

                            product:
                                createdProduct._id,

                            sku:
                                variant.sku
                                    .toUpperCase(),

                            barcode:
                                variant.barcode || "",

                            variantName,

                            attributes:
                                variant.attributes || [],

                            //--------------------------------
                            // IMPORTANT FIX
                            //--------------------------------

                            specifications,

                            images,

                            pricing: {

                                mrp,

                                sellingPrice,

                                //--------------------------------
                                // IMPORTANT FIX
                                //--------------------------------

                                costPrice,

                                tax:
                                    Number(
                                        variant.pricing?.tax || 0
                                    ),

                                discount

                            },

                            //--------------------------------
                            // DEFAULT INVENTORY
                            //--------------------------------

                            inventory: {

                                stock:
                                    Number(
                                        variant.inventory?.stock || 0
                                    ),

                                reserved:
                                    Number(
                                        variant.inventory?.reserved || 0
                                    ),

                                lowStockAlert:
                                    Number(
                                        variant.inventory?.lowStockAlert || 5
                                    )

                            },

                            //--------------------------------
                            // DEFAULT SHIPPING
                            //--------------------------------

                            shipping: {

                                weight:
                                    Number(
                                        variant.shipping?.weight || 0
                                    ),

                                length:
                                    Number(
                                        variant.shipping?.length || 0
                                    ),

                                breadth:
                                    Number(
                                        variant.shipping?.breadth || 0
                                    ),

                                height:
                                    Number(
                                        variant.shipping?.height || 0
                                    )

                            },

                            isDefault:
                                i === 0,

                            status:
                                "active"

                        }
                    ],
                    {
                        session
                    }
                );

            //--------------------------------------------
            // FIRST VARIANT
            //--------------------------------------------

            if (i === 0) {

                firstVariant =
                    createdVariants[0];

            }

        }

        //--------------------------------------------------
        // NEXT PART
        //--------------------------------------------------
                //--------------------------------------------------
        // UPDATE PRODUCT
        //--------------------------------------------------

        await Product.findByIdAndUpdate(

            createdProduct._id,

            {

                defaultVariant: firstVariant?._id || null,

                variantCount: variants.length

            },

            {

                session

            }

        );

        //--------------------------------------------------
        // COMMIT TRANSACTION
        //--------------------------------------------------

        await session.commitTransaction();

        session.endSession();

        //--------------------------------------------------
        // SUCCESS
        //--------------------------------------------------

        return res.status(201).json({

            success: true,

            message: "Product created successfully.",

            product: {

                _id: createdProduct._id,

                title: createdProduct.title,

                slug: createdProduct.slug,

                variantCount: variants.length

            }

        });

    }

    catch (err) {

        //--------------------------------------------------
        // ROLLBACK DATABASE
        //--------------------------------------------------

        await session.abortTransaction();

        session.endSession();

        //--------------------------------------------------
        // DELETE UPLOADED IMAGES
        //--------------------------------------------------

        if (uploadedImages.length) {

            for (const publicId of uploadedImages) {

                try {

                    await cloudinary.uploader.destroy(publicId);

                }

                catch (e) {

                    console.error(
                        "Cloudinary Cleanup Error:",
                        e.message
                    );

                }

            }

        }

        //--------------------------------------------------
        // ERROR
        //--------------------------------------------------

        console.error(err);

        return res.status(500).json({

            success: false,

            message: err.message || "Failed to create product."

        });

    }

};

export const getAllSeller = async (req, res) => {
  try {
    const sellers = await Seller.find({})
      .select("_id fullName store.storeName");

    return res.status(200).json({
      success: true,
      sellers,
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
