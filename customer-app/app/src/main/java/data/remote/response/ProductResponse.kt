package data.remote.response

import data.model.product.Product

data class ProductResponse(
    val success: Boolean,
    val count: Int,
    val products: List<Product>
)