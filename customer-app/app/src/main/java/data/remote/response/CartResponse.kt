package data.remote.response

import data.model.product.Product


data class CartResponse (
    val success: Boolean,
    val count: Int,
    val subTotal: Int,        // Naya variable name
    val shippingCharges: Int, // Backend se aayega
    val grandTotal: Int,      // Backend se aayega
    val cartItems: List<CartItemResponse>,
    val message: String? = null
)

data class CartItemResponse(
    val _id: String,
    val user: String,
    val product: Product?,
    val quantity: Int,
    val varient: String?
)