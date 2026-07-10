package data.remote.request

import data.remote.response.CartItemResponse

data class CreateOrderRequest(
    val items: List<CartItemResponse>,
    val totalAmount: Double,
    val addressId: String,
    val paymentMethod: String
)