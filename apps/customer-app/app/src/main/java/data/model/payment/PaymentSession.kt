package data.model.payment

data class PaymentSession(

    val orderId: String,

    val paymentSessionId: String,

    val gatewayOrderId: String,

    val amount: Int,

    val currency: String,

    val selectedUpiPackage: String,
    val merchantUpiId: String
)