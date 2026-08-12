package data.remote.response

import data.model.order.Order

data class OrdersResponse(
    val success: Boolean,
    val totalOrders: Int,
    val orders: List<Order>,
    val pagination: Pagination?
)

data class Pagination(
    val page: Int,
    val limit: Int,
    val total: Int,
    val totalPages: Int
)
