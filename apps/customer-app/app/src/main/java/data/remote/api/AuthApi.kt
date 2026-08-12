package data.remote.api
import data.remote.request.FirebaseLoginRequest
import data.remote.response.FirebaseLoginResponse
import retrofit2.Call
import retrofit2.http.Body
import retrofit2.http.POST

interface AuthApi {
    // api/auth/firebase-login

    @POST("api/v1/auth/firebase-login")
    fun firebaseLogin(
        @Body request: FirebaseLoginRequest
    ): Call<FirebaseLoginResponse>
}