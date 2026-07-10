package data.remote.request

data class CartRequest(
    val productId: String,
    val quantity: Int,
    val variant: String
)