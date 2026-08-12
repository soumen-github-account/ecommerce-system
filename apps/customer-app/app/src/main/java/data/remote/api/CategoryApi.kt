package data.remote.api

import data.remote.response.CategoryResponse
import data.remote.response.ProductResponse
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.Path

interface CategoryApi {

    @GET("api/v1/products/categories")
    suspend fun getCategories(): CategoryResponse

    @GET("api/v1/products/products/category/{categoryId}")
    suspend fun getProductsByCategory(
        @Path("categoryId") categoryId: String
    ): ProductResponse

}