import mongoose from "mongoose";
import slugify from "slugify";

import { Product } from "../models/ProductModel.js";
import { ProductVariant } from "../models/ProductVariant.js";

import { uploadImage } from "../utils/uploadToCloudinary.js";
import { Seller } from "../models/SellerModel.js";

export const addProduct = async (req, res) => {

    const session = await mongoose.startSession();

    try {

        session.startTransaction();

        const {
            title,
            description,
            brand,
            category,
            subCategory,
            subCategoryLevel2,
            warranty,
            returnPolicy,
            seller
        } = req.body;

        const specification = req.body.specification
            ? JSON.parse(req.body.specification)
            : [];

        const highlights = req.body.highlights
        ? JSON.parse(req.body.highlights).map(h => h.value)
        : [];

        const tags = req.body.tags
        ? JSON.parse(req.body.tags).map(t => t.value)
        : [];

        const variants = req.body.variants
            ? JSON.parse(req.body.variants)
            : [];

        
        const product = await Product.create([{
            title,
            slug: slugify(title, {
                lower: true,
                strict: true
            }),
            brand,
            category,
            subCategory,
            subCategoryLevel2,
            description,
            specifcation: specification,
            highlights,
            tags,
            warranty,
            returnPolicy,
            seller,
            status: "draft"
        }], { session });

        const createdProduct = product[0];

        //---------------------------------------
        // Organize Uploaded Files
        //---------------------------------------

        const fileMap = {};
        
        if (req.files) {
            

            req.files.forEach(file => {

                if (!fileMap[file.fieldname]) {
                    fileMap[file.fieldname] = [];
                }

                fileMap[file.fieldname].push(file);

            });

        }
        //---------------------------------------
        // Save Variants
        //---------------------------------------

        for (let i = 0; i < variants.length; i++) {

            const variant = variants[i];

            //-----------------------------------
            // SKU duplicate check
            //-----------------------------------

            const skuExist = await ProductVariant.findOne({
                sku: variant.sku
            });

            if (skuExist) {

                throw new Error(`SKU ${variant.sku} already exists`);

            }

            
            let uploadedImages = [];

            const files = fileMap[`variant_${i}`] || [];

            for (let j = 0; j < files.length; j++) {

                const img = await uploadImage(
                    files[j],
                    `products/${createdProduct._id}/${variant.attributes.color || "default"}`
                );
                

                uploadedImages.push({
                    url: img.secure_url,
                    isPrimary: j === 0
                });

            }
            

            //-----------------------------------
            // Save Variant
            //-----------------------------------

            await ProductVariant.create([{

                product: createdProduct._id,

                sku: variant.sku,

                attributes: variant.attributes,

                images: uploadedImages,

                mrp: variant.mrp,

                sellingPrice: variant.sellingPrice,

                costPrice: variant.costPrice,

                stock: variant.stock,

                reservedStock: variant.reservedStock,

                weight: variant.weight,

                dimensions: variant.dimensions,

                barcode: variant.barcode,

                status: "active"

            }], { session });

        }

        //---------------------------------------
        // Commit
        //---------------------------------------

        await session.commitTransaction();

        session.endSession();

        return res.status(201).json({
            success: true,
            message: "Product Added Successfully"
        });

    }

    catch (err) {

        await session.abortTransaction();

        session.endSession();

        return res.status(500).json({

            success: false,
            message: err.message

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
