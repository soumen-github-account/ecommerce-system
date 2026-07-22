package data.remote.response

import data.model.order.Order

data class OrderDetailsResponse(

    val success: Boolean,

    val order: Order
)