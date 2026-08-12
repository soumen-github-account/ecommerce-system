package data.remote.request

data class UpdateCartRequest(
    val productId: String,
    val action: String
)