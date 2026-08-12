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
    val quantity: Int,
    val product: Product?,     // Jo humne pehle define kiya tha
    val variant: Any?,         // Ya specific variant data class
    val price: Int,            // Controller se aa raha hai
    val mrp: Int,              // Controller se aa raha hai
    val image: String?         // Controller se aa raha hai
)