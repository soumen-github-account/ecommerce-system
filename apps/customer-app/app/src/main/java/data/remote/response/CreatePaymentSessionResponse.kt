package data.remote.response

import com.google.gson.annotations.SerializedName

data class CreatePaymentSessionResponse(
    val success: Boolean?,

    val orderId: String?,

    val paymentSessionId: String?,

    val paymentMethod: String?,

    val paymentData: PaymentData?,

    @SerializedName("merchantUpiId")
    val merchantUpiId: String?,

    val razorpayKey: String?
)

data class PaymentData(

    val gatewayOrderId: String?,

    val amount: Int?,

    val currency: String?
)