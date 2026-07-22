package ui.ordersDetail

import android.app.Application
import android.util.Log
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.viewModelScope
import data.remote.response.TrackingItem
import kotlinx.coroutines.launch
import utils.TokenManager

class TrackingViewModel(
    application: Application
) : AndroidViewModel(application) {

    private val repository =
        TrackingRepository()

    val tracking = MutableLiveData<List<TrackingItem>>()

    val loading = MutableLiveData(false)

    val error = MutableLiveData<String>()

    fun loadTracking(orderId: String) {
        viewModelScope.launch {
            try {
                loading.value = true
                val token = TokenManager(getApplication()).getToken()

                if (token == null) {
                    loading.value = false
                    error.value = "Login Required"
                    return@launch
                }
                Log.d("TRACKING", "ORDER ID = $orderId")
                val response =
                    repository.getTracking(
                        "Bearer $token",
                        orderId
                    )
                loading.value = false
                Log.d(
                    "TRACKING",
                    "CODE = ${response.code()}"
                )
                if (response.isSuccessful) {

                    tracking.value =
                        response.body()?.tracking ?: emptyList()

                } else {

                    error.value =
                        response.errorBody()?.string()
                            ?: response.message()

                    Log.d(
                        "TRACKING",
                        error.value ?: ""
                    )

                }

            } catch (e: Exception) {

                loading.value = false

                error.value =
                    e.localizedMessage ?: "Something went wrong"

                Log.e(
                    "TRACKING",
                    e.toString()
                )

            }

        }

    }

}