package data.model.category

import com.google.gson.annotations.SerializedName

data class TopCategory(
    val id: String,
    val name: String,
    val img: Int,
    val subCategoryIds: List<String>
)

data class Category(
    @SerializedName("_id")
    val id: String,
    val name: String,

    @SerializedName("image", alternate = ["img", "categoryImage"])
    val img: String? = null,

    // 🔥 HOME PAGE SAFETY: Agar home page ko sirf IDs (String list) chahiye backend se, toh ye parse hoga
    @SerializedName("subCategoryIds")
    val originalIds: List<String> = emptyList(),

    // 🔥 CATEGORY PAGE SAFETY: Category fragment ke deep nested population ke liye ye object list chalegi
    @SerializedName("subCategories", alternate = ["subCategoryList"])
    val subCategoryIds: List<SubCategory> = emptyList()
)

data class SubCategory(
    @SerializedName("_id")
    val id: String,
    val name: String,

    @SerializedName("image", alternate = ["img"])
    val img: String? = null,

    @SerializedName("level2Categories", alternate = ["subCategoryLevel2Ids", "subCategoryLevel2"])
    val subCategoryLevel2Ids: List<SubCategoryLevel2> = emptyList()
)

data class SubCategoryLevel2(
    @SerializedName("_id")
    val id: String,
    val name: String,

    @SerializedName("image", alternate = ["img"])
    val img: String? = null
)