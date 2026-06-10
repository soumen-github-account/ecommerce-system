package viewmodel

import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import data.remote.api.RetrofitClient
import data.model.user.User
import kotlinx.coroutines.launch

class UserViewModel : ViewModel() {

    val user = MutableLiveData<User>()

    val loading = MutableLiveData<Boolean>()

    val error = MutableLiveData<String>()

    fun getUser(token: String) {

        loading.value = true

        viewModelScope.launch {

            try {

                val response =
                    RetrofitClient.userApi.getUser(
                        "Bearer $token"
                    )

                println("CODE = ${response.code()}")
                println("BODY = ${response.body()}")

                if (
                    response.isSuccessful &&
                    response.body()?.success == true
                ) {

                    user.value =
                        response.body()?.user

                } else {

                    error.value =
                        "Failed to fetch user"

                }

            } catch (e: Exception) {

                error.value =
                    e.message ?: "Unknown Error"

            } finally {

                loading.value = false

            }
        }
    }
}