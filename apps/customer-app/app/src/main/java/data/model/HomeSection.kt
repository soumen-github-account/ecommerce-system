package data.model

import data.model.product.Product

data class HomeSection(
    val title: String,
    val products: List<Product>
)