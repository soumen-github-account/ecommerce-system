package ui.ordersDetail

import data.remote.api.RetrofitClient
import data.remote.response.TrackingResponse
import retrofit2.Response

class TrackingRepository {

    private val api =
        RetrofitClient.userApi

    suspend fun getTracking(
        token: String,
        orderId: String
    ): Response<TrackingResponse> {
        return api.trackOrder(
            token,
            orderId
        )
    }
}