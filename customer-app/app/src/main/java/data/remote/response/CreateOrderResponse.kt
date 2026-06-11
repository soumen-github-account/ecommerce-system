package data.remote.response

data class CreateOrderResponse(

    val success: Boolean,

    val orderId: String,

    val amount: Double,

    val currency: String
)