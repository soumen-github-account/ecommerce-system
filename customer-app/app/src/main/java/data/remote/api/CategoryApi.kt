package data.remote.api

import data.remote.response.CategoryResponse
import data.remote.response.ProductResponse
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.Path

interface CategoryApi {

    @GET("api/product/categories")
    suspend fun getCategories(): CategoryResponse

    @GET("api/product/products/category/{categoryId}")
    suspend fun getProductsByCategory(
        @Path("categoryId") categoryId: String
    ): ProductResponse

    @GET("api/product/nested/{categoryId}")
    suspend fun getNestedSubCategories(
        @Path("categoryId") categoryId: String
    ): retrofit2.Response<data.remote.response.NestedCategoryResponse>

    @GET("api/category/nested-all")
    suspend fun getNestedCategories(): data.remote.response.CategoryResponse

}