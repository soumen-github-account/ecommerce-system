package data.remote.response

import data.model.product.Product

data class WishlistResponse(
    val success: Boolean,
    val message: String,
    val wishlist: List<WishlistItem>? // 🔥 dhyan se dekho yahan "List<WishlistItem>" hona chahiye!
)

data class WishlistItem(
    val _id: String,
    val user: String,
    val product: Product
)