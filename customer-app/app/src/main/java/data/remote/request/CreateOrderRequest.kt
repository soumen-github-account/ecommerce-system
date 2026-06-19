package data.remote.request

import data.remote.response.CartItemResponse

data class CreateOrderRequest(
    val items: List<CartItemResponse>,
    val totalAmount: Double
)