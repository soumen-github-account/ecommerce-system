package data.remote.request

data class FirebaseLoginRequest(
    val token: String,
    val firstName: String,
    val lastName: String,
    val email: String
)