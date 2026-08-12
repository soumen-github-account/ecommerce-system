package ui.orders

import android.app.Application
import android.util.Log
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.viewModelScope
import data.model.order.Order
import kotlinx.coroutines.launch
import utils.TokenManager

class OrdersViewModel(application: Application) :
    AndroidViewModel(application) {

    private val repository = OrderRepository()

    val orders = MutableLiveData<List<Order>>()

    val loading = MutableLiveData(false)

    val error = MutableLiveData<String>()

    fun loadOrders() {

        viewModelScope.launch {

            try {
                loading.value = true
                val token = TokenManager(getApplication()).getToken()

                Log.d("TOKEN = ", "$token")

                if (token == null) {
                    error.value = "Login Required"
                    loading.value = false
                    return@launch
                }

                val response = repository.getOrders("Bearer $token")

                loading.value = false

                if (response.isSuccessful) {
                    orders.value = response.body()?.orders ?: emptyList()
                } else {
                    Log.d("Orders error : ", response.message())
                    error.value = response.message()
                }

            } catch (e: Exception) {

                loading.value = false

                error.value = e.message

            }

        }

    }

}