package data.remote.response

import data.model.product.ProductDetails

data class ProductDetailsResponse(
    val success: Boolean,
    val product: ProductDetails
)
