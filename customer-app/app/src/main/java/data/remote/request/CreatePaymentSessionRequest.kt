package data.remote.request

data class CreatePaymentSessionRequest(

    val addressId: String,

    val paymentMethod: String,

    val upiAppPackage: String? = null
)