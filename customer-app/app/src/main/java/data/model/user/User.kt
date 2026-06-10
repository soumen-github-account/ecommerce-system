package data.model.user

data class User(
    val _id: String,
    val firstName: String,
    val lastName: String,
    val email: String?,
    val phone: String
)