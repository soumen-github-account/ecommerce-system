package data.remote.request

data class CreatePaymentSessionRequest(
    val orderId: String,
    val addressId: String,
    val paymentMethod: String,
    val upiAppPackage: String? = null
)
