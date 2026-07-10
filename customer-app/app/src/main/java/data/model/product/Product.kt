
package data.model.product
import com.google.gson.annotations.SerializedName

data class Product(
    @SerializedName("_id") val id: String?,
    @SerializedName("productId") val productId: String?,
    val variantId: String,
    val sellerId: String,
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
