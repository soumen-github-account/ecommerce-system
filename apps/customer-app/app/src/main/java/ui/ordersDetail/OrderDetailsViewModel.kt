package ui.ordersDetail

import android.app.Application
import android.util.Log
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.viewModelScope
import data.model.order.Order
import kotlinx.coroutines.launch
import utils.TokenManager

class OrderDetailsViewModel(
    application: Application
) : AndroidViewModel(application) {

    private val repository = OrderDetailsRepository()
    val order = MutableLiveData<Order>()
    val loading = MutableLiveData(false)
    val error = MutableLiveData<String>()

    fun loadOrder(orderId: String) {
        Log.d("ORDER id in view model", "ID = $orderId")


        viewModelScope.launch {

            try {

                loading.value = true

                val token =
                    TokenManager(getApplication())
                        .getToken()
                Log.d("ORDER", "TOKEN = $token")

                if (token == null) {

                    error.value = "Login Required"
                    loading.value = false
                    return@launch
                }

                val response =
                    repository.getOrder(
                        "Bearer $token",
                        orderId
                    )
                Log.d("ORDER", "CODE = ${response.code()}")

                Log.d("ORDER", "MESSAGE = ${response.message()}")

                loading.value = false

                if (response.isSuccessful) {

                    order.value =
                        response.body()?.order

                } else {

                    error.value =
                        response.message()

                }

            } catch (e: Exception) {

                loading.value = false
                error.value = e.message

            }

        }

    }

}