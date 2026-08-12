import { ProductVariant } from "../models/ProductVariant.js";
import { Product } from "../models/ProductModel.js";
import { Category } from "../models/CategoryModel.js";
import { SubCategory } from "../models/SubCategoryModel.js";
import { SubCategory2 } from "../models/SubCategoryLevel2Model.js";

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
