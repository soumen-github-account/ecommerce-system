package data.remote.response

import data.model.order.Order

data class MyOrdersResponse(
    val success: Boolean,
    val orders: List<Order>
)
