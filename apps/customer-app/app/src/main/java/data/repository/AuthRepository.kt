package data.repository

import data.remote.api.AuthApi
import data.remote.request.FirebaseLoginRequest
import data.remote.response.FirebaseLoginResponse
import retrofit2.Call

class AuthRepository(
    private val authApi: AuthApi
) {

    fun firebaseLogin(
        firebaseToken: String,
        firstName: String,
        lastName: String,
        email: String
    ): Call<FirebaseLoginResponse> {

        return authApi.firebaseLogin(
            FirebaseLoginRequest(
                token = firebaseToken,
                firstName = firstName,
                lastName = lastName,
                email = email
            )
        )
    }
}