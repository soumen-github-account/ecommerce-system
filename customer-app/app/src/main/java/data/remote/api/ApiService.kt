package data.remote.api

import data.remote.request.AddressRequest
import data.remote.request.CartRequest
import data.remote.request.OrderRequest
import data.remote.request.RemoveCartRequest
import data.remote.request.UpdateCartRequest
import data.remote.request.WishlistRequest
import data.remote.response.AddressDeleteResponse
import data.remote.response.CartResponse
import data.remote.response.OrderResponse
import data.remote.response.UserResponse
import data.remote.response.WishlistResponse
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.DELETE
import retrofit2.http.GET
import retrofit2.http.HTTP
import retrofit2.http.Header
import retrofit2.http.POST
import retrofit2.http.PUT
import retrofit2.http.Path

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

    @POST("api/user/addresses")
    suspend fun createAddress(
        @Header("Authorization") token: String,
        @Body request: AddressRequest
    ): Response<data.model.address.AddressResponse>

    @GET("api/user/addresses")
    suspend fun getUserAddresses(
        @Header("Authorization") token: String
    ): Response<data.model.address.AddressListResponse>

    @DELETE("api/user/addresses/{addressId}")
    suspend fun deleteAddress(
        @Header("Authorization") token: String,
        @Path("addressId") addressId: String
    ): Response<AddressDeleteResponse>

    @PUT("api/user/addresses/{addressId}")
    suspend fun updateAddress(
        @Header("Authorization") token: String,
        @Path("addressId") addressId: String,
        @Body request: AddressRequest
    ): Response<data.model.address.AddressResponse>

    @POST("api/payment/create-order")
    suspend fun createOrder(@Body request: OrderRequest): Response<OrderResponse>


}