package data.model.product

import com.google.gson.annotations.SerializedName
import data.model.category.Category
import data.model.category.SubCategory
import data.model.category.SubCategoryLevel2

data class Product(
    @SerializedName("_id")
    val id: String?,

    val name: String? = null,

    @SerializedName("images", alternate = ["imagesList", "image"])
    val images: List<String> = emptyList(),

    // 🔥 DUAL SUPPORT FOR CATEGORY (Object or String fallback)
    @SerializedName("category")
    private val rawCategory: Any? = null,

    // 🔥 DUAL SUPPORT FOR SUBCATEGORY
    @SerializedName("subCategory")
    private val rawSubCategory: Any? = null,

    // 🔥 DUAL SUPPORT FOR LEVEL 2
    @SerializedName("subCategoryLevel2")
    private val rawSubCategoryLevel2: Any? = null,

    val unit: String? = null,
    val type: List<String> = emptyList(),
    val stock: Int = 0,
    val price: List<Int> = emptyList(),
    val discount: Int = 0,
    val description: String? = null,
    val details: List<String> = emptyList(),
    val detailsType: List<String> = emptyList(),
    val publish: Boolean = false,
    var isWishlisted: Boolean = false
) {
    // 🛠️ GETTER FOR OBJECTS (ProductDetailsActivity ke liye)
    val categoryObj: Category?
        get() = if (rawCategory is Map<*, *>) {
            // Agar backend se poora object maps format me aaya ho
            Category(
                id = rawCategory["_id"] as? String ?: "",
                name = rawCategory["name"] as? String ?: ""
            )
        } else null

    val subCategoryObj: SubCategory?
        get() = if (rawSubCategory is Map<*, *>) {
            SubCategory(
                id = rawSubCategory["_id"] as? String ?: "",
                name = rawSubCategory["name"] as? String ?: ""
            )
        } else null

    val subCategoryLevel2Obj: SubCategoryLevel2?
        get() = if (rawSubCategoryLevel2 is Map<*, *>) {
            SubCategoryLevel2(
                id = rawSubCategoryLevel2["_id"] as? String ?: "",
                name = rawSubCategoryLevel2["name"] as? String ?: ""
            )
        } else null

    // 🛠️ GETTER FOR STRINGS / IDs (Baki logic ya references ke liye)
    val category: String?
        get() = when (rawCategory) {
            is String -> rawCategory
            is Map<*, *> -> rawCategory["_id"] as? String
            else -> null
        }

    val subCategory: String?
        get() = when (rawSubCategory) {
            is String -> rawSubCategory
            is Map<*, *> -> rawSubCategory["_id"] as? String
            else -> null
        }

    val subCategoryLevel2: String?
        get() = when (rawSubCategoryLevel2) {
            is String -> rawSubCategoryLevel2
            is Map<*, *> -> rawSubCategoryLevel2["_id"] as? String
            else -> null
        }
}