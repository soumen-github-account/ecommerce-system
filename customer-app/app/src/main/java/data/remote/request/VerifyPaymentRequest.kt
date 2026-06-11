package data.remote.request

data class VerifyPaymentRequest(
    val razorpayOrderId: String,
    val upiResponse: String
)