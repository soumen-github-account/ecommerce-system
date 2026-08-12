package viewmodel

import androidx.lifecycle.ViewModel
import data.repository.AuthRepository

class AuthViewModel(
    private val repository: AuthRepository
) : ViewModel() {

    fun firebaseLogin(
        token: String,
        firstName: String,
        lastName: String,
        email: String
    ) {

        repository.firebaseLogin(
            token,
            firstName,
            lastName,
            email
        )
    }
}