package data.remote.api

import data.remote.request.CartRequest
import data.remote.request.RemoveCartRequest
import data.remote.request.UpdateCartRequest
import data.remote.request.WishlistRequest
import data.remote.response.CartResponse
import data.remote.response.UserResponse
import data.remote.response.WishlistResponse
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.HTTP
import retrofit2.http.Header
import retrofit2.http.POST
import retrofit2.http.PUT

interface ApiService {

    @GET("api/user/getUser")
    suspend fun getUser(
        @Header("Authorization")
        token: String
    ): Response<UserResponse>

    @POST("api/user/cart")
    suspend fun addToCart(@Header("Authorization") token: String, @Body request: CartRequest) : CartResponse

    @GET("api/user/cart")
    suspend fun getCart(@Header("Authorization") token: String) : Response<CartResponse>

    @HTTP(method = "DELETE", path = "api/user/removeCartItem", hasBody = true)
    suspend fun removeFromCart(
        @Header("Authorization") token: String,
        @Body request: RemoveCartRequest
    ): Response<CartResponse>

    @PUT("api/user/cart-update-quantity")
    suspend fun updateCartQuantity(
        @Header("Authorization") token: String,
        @Body request: UpdateCartRequest
    ): Response<CartResponse>

    @POST("api/user/wishlist")
    suspend fun addToWishlist(
        @Header("Authorization") token: String,
        @Body request: WishlistRequest
    ): Response<WishlistResponse>

    @GET("api/user/wishlist")
    suspend fun getWishlist(@Header("Authorization") token: String): Response<WishlistResponse>

}