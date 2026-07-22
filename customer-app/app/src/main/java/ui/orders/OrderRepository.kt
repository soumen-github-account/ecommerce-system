package ui.orders

import data.remote.api.RetrofitClient

class OrderRepository {

    private val api = RetrofitClient.userApi

    suspend fun getOrders(
        token: String
    ) = api.getMyOrders(token)

}