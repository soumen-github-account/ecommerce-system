package data.remote.api

import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory


object RetrofitClient {
    // http://192.168.1.7:8000/
    private const val BASE_URL_LOCAL = "http://192.168.1.7:8000/"
    private const val BASE_URL_LIVE = "https://system-customer-backend.onrender.com/"

    // Yahan switch karo
    private const val IS_LOCAL = true
    private val BASE_URL = "http://192.168.1.7:8000/"
    private val retrofit by lazy {

        Retrofit.Builder()
            .baseUrl(BASE_URL)
            .addConverterFactory(
                GsonConverterFactory.create()
            )
            .build()
    }

    val authApi: AuthApi by lazy {
        retrofit.create(AuthApi::class.java)
    }

    val userApi: ApiService by lazy {
        retrofit.create(ApiService::class.java)
    }

    val categoryApi: CategoryApi by lazy {
        retrofit.create(CategoryApi::class.java)
    }

    val productApi: ProductApi by lazy {
        retrofit.create(ProductApi::class.java)
    }
}