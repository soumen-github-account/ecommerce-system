import { Product } from "../models/ProductModel.js"
import { Category } from "../models/CategoryModel.js";
import { SubCategory } from "../models/SubCategoryModel.js";
import { SubCategory2 } from "../models/SubCategoryLevel2Model.js";

export const getAllProduct = async(req, res) => {
    try {
        const products = await Product.find({})
            .populate("category")
            .populate("subCategory")
            .populate("subCategoryLevel2");

        res.json({
            success: true,
            products: products
        })
        
    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })        
    }
}

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

// 🔥 NAYA CONTROLLER: Sirf Category Fragment ke liye jisme deep nesting hai
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

export const getAllProductByCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;

        const products = await Product.find({category: categoryId})
        .populate("category")
        .populate("subCategory")
        .populate("subCategoryLevel2");

        res.status(200).json({
            success: true,
            count: products.length,
            products,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.findById(id)
        .populate("category")
        .populate("subCategory")
        .populate("subCategoryLevel2");

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        res.status(200).json({
            success: true,
            product
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
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

