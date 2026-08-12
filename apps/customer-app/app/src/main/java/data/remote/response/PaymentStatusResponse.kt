package data.remote.response

data class PaymentStatusResponse(
    val success: Boolean,
    val paymentStatus: String,
    val orderStatus: String,
    val orderId: String,
    val amount: Double,
    val paymentMethod: String
)