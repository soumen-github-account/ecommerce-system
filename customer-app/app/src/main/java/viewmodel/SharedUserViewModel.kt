package viewmodel

import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel

class SharedUserViewModel : ViewModel() {

    val userEmail = MutableLiveData<String?>()
    val userPhone = MutableLiveData<String?>()

    fun setUser(email: String?, phone: String?) {
        userEmail.value = email
        userPhone.value = phone
    }
}