package data.remote.response

import data.model.user.User

data class FirebaseLoginResponse(
    val success: Boolean,
    val message: String,
    val token: String,
    val user: User
)

//data class FirebaseLoginResponse(
//    val success: Boolean,
//    val message: String,
//    val data: LoginData
//)
//data class LoginData(
//    val accessToken: String,
//    val refreshToken: String,
//    val user: User
//)