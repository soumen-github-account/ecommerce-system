package data.remote.response

data class VerifyPaymentResponse(

    val success: Boolean,

    val paymentVerified: Boolean,

    val message: String
)