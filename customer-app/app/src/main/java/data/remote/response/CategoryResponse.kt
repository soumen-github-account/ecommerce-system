package data.remote.response
import data.model.category.Category


data class CategoryResponse(
    val success: Boolean,
    val count: Int,
    val categories: List<Category>
)