package ui.ordersDetail

import data.model.order.Order
import data.model.order.details.TrackingModel

object TrackingUtils {

    fun getTracking(
        order: Order
    ): List<TrackingModel> {

        val statusList = listOf(

            "PLACED",
            "CONFIRMED",
            "PACKED",
            "SHIPPED",
            "OUT_FOR_DELIVERY",
            "DELIVERED"

        )

        val currentIndex =
            statusList.indexOf(order.status)

        return statusList.mapIndexed { index, status ->

            TrackingModel(

                title = when (status) {

                    "PLACED" ->
                        "Order Placed"

                    "CONFIRMED" ->
                        "Order Confirmed"

                    "PACKED" ->
                        "Packed"

                    "SHIPPED" ->
                        "Shipped"

                    "OUT_FOR_DELIVERY" ->
                        "Out For Delivery"

                    "DELIVERED" ->
                        "Delivered"

                    else ->
                        status
                },

                description = when (status) {

                    "PLACED" ->
                        "Your order has been placed successfully."

                    "CONFIRMED" ->
                        "Seller has confirmed your order."

                    "PACKED" ->
                        "Your package has been packed."

                    "SHIPPED" ->
                        "Your package has been shipped."

                    "OUT_FOR_DELIVERY" ->
                        "Your package is out for delivery."

                    "DELIVERED" ->
                        "Order delivered successfully."

                    else ->
                        ""
                },

                date = formatDate(order.createdAt),

                completed = index <= currentIndex

            )

        }

    }

    private fun formatDate(
        date: String
    ): String {

        return try {

            date
                .replace("T", " ")
                .substring(0, 16)

        } catch (e: Exception) {

            date

        }

    }

}