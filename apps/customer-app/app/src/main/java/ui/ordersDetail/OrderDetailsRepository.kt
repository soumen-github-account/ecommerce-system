package ui.ordersDetail

import data.remote.api.RetrofitClient

class OrderDetailsRepository {
    private val api = RetrofitClient.userApi

    suspend fun getOrder(
        token: String,
        orderId: String
    ) = api.getOrderDetails(token, orderId)
}