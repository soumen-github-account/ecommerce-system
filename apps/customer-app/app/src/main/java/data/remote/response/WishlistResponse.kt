package data.remote.response
import com.google.gson.annotations.SerializedName
import data.model.product.Attribute
import data.model.product.Inventory
import data.model.product.Pricing
import data.model.product.Product

data class WishlistResponse(
    val success: Boolean,
    val totalItems: Int,
    val wishlist: List<Product>
)

data class WishlistData(
    val _id: String,
    val user: String,
    val items: List<WishlistItem>
)
data class WishlistItem(

    val product: WishlistProduct?,

    val variant: WishlistVariant?,

    val seller: WishlistSeller?
)

data class WishlistProduct(

    @SerializedName("_id")
    val productId: String,

    val title: String?,

    val slug: String?,

    val brand: String?,
    val highlights: List<String>?
)

data class WishlistVariant(
    @SerializedName("_id")
    val variantId: String,
    val variantName: String?,
    val attributes: List<Attribute>?,
    val pricing: Pricing?,
    val inventory: Inventory?,
    val images: List<ImageItem>?
)

data class WishlistSeller(
    @SerializedName("_id")
    val sellerId: String
)

data class ImageItem(
    val url: String?
)