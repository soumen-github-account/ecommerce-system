package data.remote.response

data class NestedCategoryResponse(
    val success: Boolean,
    val count: Int,
    val data: List<SubCategorySection>
)

data class SubCategorySection(
    val _id: String,
    val name: String,
    val category: String,
    val subCategoryLevel2List: List<Level2Item>
)

data class Level2Item(
    val _id: String,
    val name: String,
    val image: String? = null
)

