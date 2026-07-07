
package data.model.product
import com.google.gson.annotations.SerializedName
import data.model.category.Category
import data.model.category.SubCategory
import data.model.category.SubCategoryLevel2

//import com.google.gson.annotations.SerializedName
//import data.model.category.Category
//import data.model.category.SubCategory
//import data.model.category.SubCategoryLevel2
//
//data class Product(
//    @SerializedName("_id")
//    val id: String?,
//
//    val name: String? = null,
//
//    @SerializedName("images", alternate = ["imagesList", "image"])
//    val images: List<String> = emptyList(),
//
//    // 🔥 DUAL SUPPORT FOR CATEGORY (Object or String fallback)
//    @SerializedName("category")
//    private val rawCategory: Any? = null,
//    private
//    // 🔥 DUAL SUPPORT FOR SUBCATEGORY
//    @SerializedName("subCategory")
//     val rawSubCategory: Any? = null,
//
//    // 🔥 DUAL SUPPORT FOR LEVEL 2
//    @SerializedName("subCategoryLevel2")
//    private val rawSubCategoryLevel2: Any? = null,
//
//    val unit: String? = null,
//    val type: List<String> = emptyList(),
//    val stock: Int = 0,
//    val price: List<Int> = emptyList(),
//    val discount: Int = 0,
//    val description: String? = null,
//    val details: List<String> = emptyList(),
//    val detailsType: List<String> = emptyList(),
//    val publish: Boolean = false,
//    var isWishlisted: Boolean = false
//) {
//    // 🛠️ GETTER FOR OBJECTS (ProductDetailsActivity ke liye)
//    val categoryObj: Category?
//        get() = if (rawCategory is Map<*, *>) {
//            // Agar backend se poora object maps format me aaya ho
//            Category(
//                id = rawCategory["_id"] as? String ?: "",
//                name = rawCategory["name"] as? String ?: ""
//            )
//        } else null
//
//    val subCategoryObj: SubCategory?
//        get() = if (rawSubCategory is Map<*, *>) {
//            SubCategory(
//                id = rawSubCategory["_id"] as? String ?: "",
//                name = rawSubCategory["name"] as? String ?: ""
//            )
//        } else null
//
//    val subCategoryLevel2Obj: SubCategoryLevel2?
//        get() = if (rawSubCategoryLevel2 is Map<*, *>) {
//            SubCategoryLevel2(
//                id = rawSubCategoryLevel2["_id"] as? String ?: "",
//                name = rawSubCategoryLevel2["name"] as? String ?: ""
//            )
//        } else null
//
//    // 🛠️ GETTER FOR STRINGS / IDs (Baki logic ya references ke liye)
//    val category: String?
//        get() = when (rawCategory) {
//            is String -> rawCategory
//            is Map<*, *> -> rawCategory["_id"] as? String
//            else -> null
//        }
//
//    val subCategory: String?
//        get() = when (rawSubCategory) {
//            is String -> rawSubCategory
//            is Map<*, *> -> rawSubCategory["_id"] as? String
//            else -> null
//        }
//
//    val subCategoryLevel2: String?
//        get() = when (rawSubCategoryLevel2) {
//            is String -> rawSubCategoryLevel2
//            is Map<*, *> -> rawSubCategoryLevel2["_id"] as? String
//            else -> null
//        }
//}

data class Product(
    @SerializedName("_id") val id: String?,
    @SerializedName("productId") val productId: String?, // Controller ye field bhej raha hai
    val title: String?,
    val slug: String?,
    val brand: String?,
    val category: String?,
    val subCategory: String?,
    val subCategoryLevel2: String?,
    val variantName: String?,
    val attributes: List<Attribute>?,
    val image: String?, // Controller flat image string bhej raha hai
    val pricing: Pricing?,
    val inventory: Inventory?,
    val highlights: List<String>?,
    var isWishlisted: Boolean = false // Local UI state
)

data class Pricing(
    val mrp: Double,
    val sellingPrice: Double,
    val costPrice: Double,
    val tax: Double,
    val discount: Double
)

data class Attribute(
    val name: String,
    val value: String
)
data class Inventory(
    val stock: Int
)
