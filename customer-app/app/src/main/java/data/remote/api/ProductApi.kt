package data.remote.api

import data.remote.response.ProductDetailsResponse
import retrofit2.http.GET
import retrofit2.http.Path

interface ProductApi {
    @GET("api/product/products/{id}")
    suspend fun getProductById(
        @Path("id") id: String
    ): ProductDetailsResponse
}