package data.remote.response

import data.model.user.User

data class UserResponse(
    val success: Boolean,
    val user: User
)