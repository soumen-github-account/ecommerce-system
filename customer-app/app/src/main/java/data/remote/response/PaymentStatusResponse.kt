package data.remote.response

data class PaymentStatusResponse(

    val success: Boolean,

    val status: String,

    val orderId: String,

    val amount: Double,

    val paymentMethod: String
)